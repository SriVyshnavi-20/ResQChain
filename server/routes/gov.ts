import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { audit } from '../lib/audit';
import { me, requireRole } from '../lib/auth';
import { notFound } from '../lib/errors';
import { agencyDto, zoneDto } from '../lib/serialize';
import { nowIso } from '../lib/time';
import { parse, str } from '../lib/validate';

export const govRouter = Router();
govRouter.use(requireRole('Government Official'));

type ZRow = Parameters<typeof zoneDto>[0];
type ARow = Parameters<typeof agencyDto>[0];

govRouter.get('/zones', (_req, res) => {
  res.json({ zones: (db.prepare(`SELECT * FROM disaster_zones ORDER BY rowid`).all() as ZRow[]).map(zoneDto) });
});

govRouter.patch('/zones/:id/status', (req, res) => {
  const user = me(req);
  const { status } = parse(
    z.object({ status: z.enum(['Active Crisis', 'Containment in Progress', 'Standby / Under Watch']) }),
    req.body
  );
  const id = String(req.params.id);
  const r = db.prepare(`UPDATE disaster_zones SET status = ?, updated_at = ? WHERE id = ?`).run(status, nowIso(), id);
  if (r.changes === 0) throw notFound('Disaster zone not found.');
  audit(user, 'ZONE_STATUS_CHANGED', 'disaster_zone', id, { status });
  const row = db.prepare(`SELECT * FROM disaster_zones WHERE id = ?`).get(id) as ZRow;
  res.json({ zone: zoneDto(row), message: `Disaster zone status updated to: ${status}` });
});

govRouter.get('/agencies', (_req, res) => {
  res.json({ agencies: (db.prepare(`SELECT * FROM gov_agencies ORDER BY rowid`).all() as ARow[]).map(agencyDto) });
});

govRouter.patch('/agencies/:id/sector', (req, res) => {
  const user = me(req);
  const { sector } = parse(z.object({ sector: str(2, 200) }), req.body);
  const id = String(req.params.id);
  const r = db.prepare(`UPDATE gov_agencies SET assigned_sector = ?, status = 'Deployed' WHERE id = ?`).run(sector, id);
  if (r.changes === 0) throw notFound('Agency not found.');
  audit(user, 'AGENCY_REDEPLOYED', 'agency', id, { sector });
  const row = db.prepare(`SELECT * FROM gov_agencies WHERE id = ?`).get(id) as ARow;
  res.json({ agency: agencyDto(row), message: `Battalion redeployed to sector: ${sector}` });
});

govRouter.post('/coordination/reinforcements', (req, res) => {
  audit(me(req), 'REINFORCEMENTS_REQUISITIONED', 'coordination', undefined, 'Air Force helicopter & NDRF reserve battalion from Arakkonam Base');
  res.json({ message: 'Air Force Helicopter & NDRF Reserve Battalion requisitioned from Arakkonam Base.' });
});

govRouter.post('/coordination/mutual-aid', (req, res) => {
  audit(me(req), 'MUTUAL_AID_TRIGGERED', 'coordination', undefined, 'Inter-district mutual aid broadcast to neighbouring district collectors');
  res.json({ message: 'Inter-District Mutual Aid protocol broadcasted to neighboring district collectors.' });
});

govRouter.get('/audit-log', (_req, res) => {
  const rows = db.prepare(`SELECT * FROM audit_log ORDER BY id DESC LIMIT 200`).all();
  res.json({ entries: rows });
});
