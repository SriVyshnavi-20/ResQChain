import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import { db } from '../db';
import { forbidden, unauthorized } from './errors';
import type { Role, UserRow } from './rows';

export type AuthUser = UserRow;

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}

interface TokenPayload {
  sub: string;
  tv: number;
}

export const hashPassword = (plain: string) => bcrypt.hash(plain, config.bcryptRounds);
export const verifyPassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);

export function signToken(user: Pick<UserRow, 'id' | 'token_version'>): string {
  return jwt.sign({ tv: user.token_version } satisfies Omit<TokenPayload, 'sub'>, config.jwtSecret, {
    subject: String(user.id),
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn']
  });
}

const userById = db.prepare(`SELECT * FROM users WHERE id = ?`);

function resolveUser(req: Request): AuthUser | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  if (!token) return null;
  try {
    const payload = jwt.verify(token, config.jwtSecret) as TokenPayload;
    const user = userById.get(Number(payload.sub)) as UserRow | undefined;
    if (!user || user.token_version !== payload.tv) return null;
    return user;
  } catch {
    return null;
  }
}

/** Requires a valid session. */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const user = resolveUser(req);
  if (!user) return next(unauthorized('Your session has expired. Please log in again.'));
  req.user = user;
  next();
}

/** Attaches the user when a valid token is present, otherwise continues anonymously. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const user = resolveUser(req);
  if (user) req.user = user;
  next();
}

/** Requires a valid session AND one of the given roles. */
export const requireRole =
  (...allowed: Role[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    requireAuth(req, res, (err?: unknown) => {
      if (err) return next(err);
      if (!allowed.includes(req.user!.role)) {
        return next(forbidden(`This action is restricted to: ${allowed.join(', ')}.`));
      }
      next();
    });
  };

export const me = (req: Request): AuthUser => req.user!;
