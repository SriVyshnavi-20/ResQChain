import { Router } from 'express';
import { z } from 'zod';
import { db, nextId } from '../db';
import { audit } from '../lib/audit';
import { me, requireRole } from '../lib/auth';
import { announcementDto } from '../lib/serialize';
import { nowIso } from '../lib/time';
import { parse, str } from '../lib/validate';
import { listAnnouncements } from './bootstrap';

export const announcementsRouter = Router();

announcementsRouter.get('/', (_req, res) => res.json({ announcements: listAnnouncements() }));

const schema = z.object({
  title: str(2, 120),
  message: str(3, 1500),
  type: z.enum(['emergency', 'warning', 'info']),
  zone: str(1, 150)
});

/** "Tamil Nadu State Disaster Management Authority (TNSDMA)" -> "TNSDMA State Disaster Operations Center" */
function issuer(dept: string | null, org: string | null): string {
  const src = dept || org || '';
  const abbr = /\(([A-Z]{3,})\)/.exec(src)?.[1];
  return abbr ? `${abbr} State Disaster Operations Center` : src || 'State Disaster Operations Center';
}

announcementsRouter.post('/', requireRole('Government Official'), (req, res) => {
  const user = me(req);
  const b = parse(schema, req.body);
  const id = nextId('ANN');
  db.prepare(
    `INSERT INTO announcements (id, title, message, type, zone, issued_by, created_by, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, b.title, b.message, b.type, b.zone, issuer(user.department, user.organization), user.id, nowIso());
  audit(user, 'ALERT_BROADCAST', 'announcement', id, { type: b.type, zone: b.zone });
  const row = db.prepare(`SELECT * FROM announcements WHERE id = ?`).get(id) as Parameters<typeof announcementDto>[0];
  res.status(201).json({ announcement: announcementDto(row), message: `STATEWIDE EMERGENCY BROADCAST "${b.title}" ISSUED!` });
});
