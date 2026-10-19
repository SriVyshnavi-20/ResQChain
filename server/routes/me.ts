import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { audit } from '../lib/audit';
import { me, requireAuth, requireRole } from '../lib/auth';
import { conflict } from '../lib/errors';
import type { UserRow } from '../lib/rows';
import { PREFERENCE_KEYS, defaultPreferences, userDto } from '../lib/serialize';
import { nowIso } from '../lib/time';
import { email, optStr, parse, str } from '../lib/validate';

export const meRouter = Router();
meRouter.use(requireAuth);

const fresh = (id: number) => db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as UserRow;

const profileSchema = z.object({
  name: str(2, 100).optional(),
  email: email().optional(),
  phone: optStr(30),
  location: optStr(200),
  familySize: optStr(50),
  needType: optStr(100),
  zone: optStr(100),
  shift: optStr(60),
  skills: z.array(str(1, 60)).max(30).optional(),
  organization: optStr(200),
  designation: optStr(200),
  department: optStr(200)
});

meRouter.patch('/', (req, res) => {
  const user = me(req);
  const b = parse(profileSchema, req.body);

  if (b.email && b.email !== user.email.toLowerCase()) {
    const taken = db.prepare(`SELECT id FROM users WHERE email = ? AND id != ?`).get(b.email, user.id);
    if (taken) throw conflict('That email address is already in use.');
  }

  // Only fields relevant to the account's role may be changed.
  const sets: Record<string, unknown> = {};
  const put = (col: string, v: unknown) => v !== undefined && (sets[col] = v);
  put('name', b.name);
  put('email', b.email);
  put('phone', b.phone);
  put('location', b.location);
  if (user.role === 'Victim') {
    put('family_size', b.familySize);
    put('need_type', b.needType);
  }
  if (user.role === 'Volunteer') {
    put('zone', b.zone);
    put('shift', b.shift);
    put('skills', b.skills ? JSON.stringify(b.skills) : undefined);
  }
  if (user.role === 'NGO') put('organization', b.organization);
  if (user.role === 'Government Official') {
    put('designation', b.designation);
    put('department', b.department);
  }

  db.transaction(() => {
    const cols = Object.keys(sets);
    if (cols.length) {
      db.prepare(`UPDATE users SET ${cols.map((c) => `${c} = @${c}`).join(', ')}, updated_at = @updated_at WHERE id = @id`).run({
        ...sets,
        updated_at: nowIso(),
        id: user.id
      });
    }
    // NGO data is keyed by organization name; keep it attached when the NGO is renamed.
    if (user.role === 'NGO' && typeof sets.organization === 'string' && user.organization && sets.organization !== user.organization) {
      const [o, n] = [user.organization, sets.organization];
      db.prepare(`UPDATE inventory SET organization = ? WHERE organization = ?`).run(n, o);
      db.prepare(`UPDATE ngo_volunteers SET organization = ? WHERE organization = ?`).run(n, o);
      db.prepare(`UPDATE ngo_camps SET ngo_name = ? WHERE ngo_name = ?`).run(n, o);
      db.prepare(`UPDATE dispatch_log SET organization = ? WHERE organization = ?`).run(n, o);
    }
  })();

  audit(user, 'PROFILE_UPDATED', 'user', user.id);
  res.json({ user: userDto(fresh(user.id)), message: 'Profile updated successfully.' });
});

meRouter.put('/preferences', (req, res) => {
  const user = me(req);
  const allowed = PREFERENCE_KEYS[user.role];
  const body = parse(z.record(z.string(), z.boolean()), req.body);
  const current = { ...defaultPreferences(user.role), ...JSON.parse(user.preferences || '{}') };
  for (const k of allowed) if (typeof body[k] === 'boolean') (current as Record<string, boolean>)[k] = body[k];
  db.prepare(`UPDATE users SET preferences = ?, updated_at = ? WHERE id = ?`).run(JSON.stringify(current), nowIso(), user.id);
  res.json({ user: userDto(fresh(user.id)), message: 'Preferences saved successfully.' });
});

meRouter.put('/safe', requireRole('Victim'), (req, res) => {
  const user = me(req);
  const { isSafe } = parse(z.object({ isSafe: z.boolean() }), req.body);
  db.prepare(`UPDATE users SET is_safe = ?, updated_at = ? WHERE id = ?`).run(isSafe ? 1 : 0, nowIso(), user.id);
  audit(user, isSafe ? 'MARKED_SAFE' : 'SAFE_REVOKED', 'user', user.id);
  res.json({
    user: userDto(fresh(user.id)),
    message: isSafe ? 'You are marked as SAFE on the public registry.' : 'Safe status revoked.'
  });
});

meRouter.put('/availability', requireRole('Volunteer'), (req, res) => {
  const user = me(req);
  const { availability } = parse(z.object({ availability: z.enum(['ACTIVE', 'STANDBY', 'OFFLINE']) }), req.body);
  db.prepare(`UPDATE users SET availability = ?, updated_at = ? WHERE id = ?`).run(availability, nowIso(), user.id);
  const message =
    availability === 'ACTIVE'
      ? 'Volunteer status: ACTIVE. Ready to receive emergency assignments.'
      : availability === 'STANDBY'
        ? 'Volunteer status: STANDBY. On reserve notice.'
        : 'Volunteer status: OFFLINE. Currently unavailable for assignments.';
  res.json({ user: userDto(fresh(user.id)), message });
});
