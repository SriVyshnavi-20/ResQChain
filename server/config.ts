import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const serverDir = path.dirname(fileURLToPath(import.meta.url));
export const projectRoot = path.resolve(serverDir, '..');

dotenv.config({ path: path.join(projectRoot, '.env') });

const env = process.env;
const isProduction = env.NODE_ENV === 'production';

function resolveJwtSecret(): string {
  if (env.JWT_SECRET && env.JWT_SECRET.length >= 16) return env.JWT_SECRET;
  if (isProduction) {
    throw new Error('JWT_SECRET must be set (min 16 chars) when NODE_ENV=production.');
  }
  // Development convenience: generate once and persist so sessions survive restarts.
  const dataDir = path.join(serverDir, 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  const file = path.join(dataDir, '.jwt_secret');
  if (fs.existsSync(file)) return fs.readFileSync(file, 'utf8').trim();
  const secret = crypto.randomBytes(48).toString('hex');
  fs.writeFileSync(file, secret, { mode: 0o600 });
  return secret;
}

export const config = {
  isProduction,
  port: Number(env.PORT) || 4000,
  dbPath: env.DATABASE_PATH ? path.resolve(projectRoot, env.DATABASE_PATH) : path.join(serverDir, 'data', 'resqchain.db'),
  jwtSecret: resolveJwtSecret(),
  jwtExpiresIn: env.JWT_EXPIRES_IN || '7d',
  corsOrigins: (env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean),
  trustProxy: env.TRUST_PROXY ? Number(env.TRUST_PROXY) || env.TRUST_PROXY === 'true' : false,
  timezone: env.APP_TIMEZONE || 'Asia/Kolkata',
  // NGO / Government sign-up: when a code is set here it is ALWAYS required. When unset, sign-up is open
  // in development but disabled in production (so strangers can't create government accounts).
  govInviteCode: env.GOV_INVITE_CODE || '',
  ngoInviteCode: env.NGO_INVITE_CODE || '',
  distDir: path.join(projectRoot, 'dist'),
  serveStatic: env.SERVE_STATIC ? env.SERVE_STATIC === 'true' : isProduction,
  bcryptRounds: Number(env.BCRYPT_ROUNDS) || 10
};
