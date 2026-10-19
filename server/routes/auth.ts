import crypto from 'node:crypto';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { config } from '../config';
import { db } from '../db';
import { audit } from '../lib/audit';
import { hashPassword, me, requireAuth, signToken, verifyPassword } from '../lib/auth';
import { badRequest, conflict, forbidden, HttpError } from '../lib/errors';
import type { Role, UserRow } from '../lib/rows';
import { defaultPreferences, userDto } from '../lib/serialize';
import { nowIso } from '../lib/time';
import { email, optStr, parse, roles, str } from '../lib/validate';

export const authRouter = Router();

// Compared against when the email does not exist, so response time doesn't reveal which emails are registered.
const DUMMY_HASH = bcrypt.hashSync('resqchain-timing-equaliser', config.bcryptRounds);

const password = z.string().min(8, 'must be at least 8 characters').max(128, 'must be at most 128 characters');

const loginSchema = z.object({
  email: str(3, 254),
  password: z.string().min(1, 'is required').max(128),
  role: z.enum(roles, { error: 'must be a valid role' })
});

authRouter.post('/login', async (req, res) => {
  const body = parse(loginSchema, req.body);
  const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(body.email) as UserRow | undefined;
  const ok = await verifyPassword(body.password, user?.password_hash ?? DUMMY_HASH);
  if (!user || !ok) throw new HttpError(401, 'Invalid email, password or role.', 'INVALID_CREDENTIALS');
  if (user.role !== body.role) {
    throw forbidden(`This account is registered as "${user.role}". Please select that role to sign in.`);
  }
  audit(user, 'LOGIN', 'user', user.id);
  res.json({ token: signToken(user), user: userDto(user), message: `Welcome back, ${user.name}! Logged in as ${roleLabel(user.role)}.` });
});

const roleLabel = (r: Role) => (r === 'NGO' ? 'NGO Partner' : r);

const registerSchema = z.object({
  role: z.enum(roles, { error: 'must be a valid role' }),
  name: str(2, 100),
  email: email(),
  password,
  phone: optStr(30),
  location: optStr(200),
  organization: optStr(200),
  zone: optStr(100),
  familySize: optStr(50),
  needType: optStr(100),
  designation: optStr(200),
  department: optStr(200),
  inviteCode: optStr(100)
});

authRouter.post('/register', async (req, res) => {
  const b = parse(registerSchema, req.body);

  // NGO / Government accounts: an invite code is required whenever one is configured. With none configured,
  // sign-up is open in development and closed in production.
  if (b.role === 'Government Official' || b.role === 'NGO') {
    const expected = b.role === 'NGO' ? config.ngoInviteCode : config.govInviteCode;
    if (expected) {
      const given = Buffer.from(b.inviteCode ?? '');
      const want = Buffer.from(expected);
      if (given.length !== want.length || !crypto.timingSafeEqual(given, want)) {
        throw forbidden('Invalid invite code.');
      }
    } else if (config.isProduction) {
      throw forbidden(`Sign-up for "${b.role}" accounts is disabled. Contact an administrator.`);
    }
  }
  if (b.role === 'NGO' && !b.organization) throw badRequest('organization: is required for NGO accounts');

  if (db.prepare(`SELECT 1 FROM users WHERE email = ?`).get(b.email)) {
    throw conflict('An account with this email already exists.');
  }

  const now = nowIso();
  const id = Number(
    db
      .prepare(
        `INSERT INTO users (role, name, email, password_hash, phone, location, family_size, need_type, preferences, zone,
           shift, skills, availability, organization, registration_number, coverage_zones, designation, department,
           badge_number, official_id, jurisdiction, created_at, updated_at)
         VALUES (@role, @name, @email, @password_hash, @phone, @location, @family_size, @need_type, @preferences, @zone,
           @shift, @skills, 'ACTIVE', @organization, @registration_number, @coverage_zones, @designation, @department,
           @badge_number, @official_id, @jurisdiction, @now, @now)`
      )
      .run({
        role: b.role,
        name: b.name,
        email: b.email,
        password_hash: await hashPassword(b.password),
        phone: b.phone || null,
        location: b.location || '',
        family_size: b.role === 'Victim' ? b.familySize || '1 member' : null,
        need_type: b.role === 'Victim' ? b.needType || '' : null,
        preferences: JSON.stringify(defaultPreferences(b.role)),
        zone: b.role === 'Volunteer' ? b.zone || 'Unassigned Zone' : null,
        shift: b.role === 'Volunteer' ? '9:00 AM - 5:00 PM' : null,
        skills: b.role === 'Volunteer' ? '[]' : null,
        organization: b.organization || (b.role === 'Government Official' ? b.department || null : null),
        registration_number: b.role === 'NGO' ? `NGO-REG-${Date.now().toString(36).toUpperCase()}` : null,
        coverage_zones: b.role === 'NGO' ? '[]' : null,
        designation: b.role === 'Government Official' ? b.designation || null : null,
        department: b.role === 'Government Official' ? b.department || null : null,
        badge_number: b.role === 'Volunteer' ? `VOL-${Math.floor(1000 + Math.random() * 9000)}` : null,
        official_id: b.role === 'Government Official' ? `GOV-${Date.now().toString(36).toUpperCase()}` : null,
        jurisdiction: null,
        now
      }).lastInsertRowid
  );

  const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as UserRow;
  audit(user, 'REGISTER', 'user', user.id);
  // No token on purpose: a new account must log in explicitly.
  res.status(201).json({ user: userDto(user), message: `Account created for ${user.name}. Please log in.` });
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: userDto(me(req)) });
});

authRouter.post('/logout', (_req, res) => {
  // Tokens are stateless; the client discards its copy. Use /change-password to invalidate all sessions.
  res.status(204).end();
});

authRouter.post('/change-password', requireAuth, async (req, res) => {
  const b = parse(z.object({ currentPassword: z.string().min(1), newPassword: password }), req.body);
  const user = me(req);
  if (!(await verifyPassword(b.currentPassword, user.password_hash))) {
    throw new HttpError(400, 'Current password is incorrect.', 'BAD_PASSWORD');
  }
  db.prepare(`UPDATE users SET password_hash = ?, token_version = token_version + 1, updated_at = ? WHERE id = ?`).run(
    await hashPassword(b.newPassword),
    nowIso(),
    user.id
  );
  const fresh = db.prepare(`SELECT * FROM users WHERE id = ?`).get(user.id) as UserRow;
  audit(user, 'PASSWORD_CHANGED', 'user', user.id);
  res.json({ token: signToken(fresh), message: 'Password updated. Other sessions have been signed out.' });
});

const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex');

authRouter.post('/forgot-password', (req, res) => {
  const { email } = parse(z.object({ email: str(3, 254) }), req.body);
  const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email) as UserRow | undefined;
  const response: Record<string, unknown> = {
    message: 'If an account exists for that email, a password reset link has been issued.'
  };
  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    db.prepare(`INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES (?, ?, ?)`).run(
      sha256(token),
      user.id,
      new Date(Date.now() + 60 * 60_000).toISOString()
    );
    audit(user, 'PASSWORD_RESET_REQUESTED', 'user', user.id);
    // No mail transport is configured. Outside production the token is returned for local testing.
    console.log(`[auth] Password reset token for ${user.email}: ${token}`);
    if (!config.isProduction) response.resetToken = token;
  }
  res.json(response);
});

authRouter.post('/reset-password', async (req, res) => {
  const b = parse(z.object({ token: str(10, 200), password }), req.body);
  const row = db
    .prepare(`SELECT * FROM password_resets WHERE token_hash = ?`)
    .get(sha256(b.token)) as { token_hash: string; user_id: number; expires_at: string; used_at: string | null } | undefined;
  if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now()) {
    throw badRequest('This reset link is invalid or has expired.');
  }
  const newHash = await hashPassword(b.password);
  db.transaction(() => {
    db.prepare(`UPDATE users SET password_hash = ?, token_version = token_version + 1, updated_at = ? WHERE id = ?`).run(
      newHash,
      nowIso(),
      row.user_id
    );
    db.prepare(`UPDATE password_resets SET used_at = ? WHERE token_hash = ?`).run(nowIso(), row.token_hash);
  })();
  res.json({ message: 'Password reset successfully. You can now sign in.' });
});
