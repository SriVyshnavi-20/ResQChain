import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { audit } from '../lib/audit';
import { me, requireRole } from '../lib/auth';
import { notFound } from '../lib/errors';
import { ngoCampDto, ngoVolunteerDto } from '../lib/serialize';
import { parse, str } from '../lib/validate';

export const ngoRouter = Router();
ngoRouter.use(requireRole('NGO'));

type VRow = Parameters<typeof ngoVolunteerDto>[0];

ngoRouter.get('/volunteers', (req, res) => {
  const rows = db.prepare(`SELECT * FROM ngo_volunteers WHERE organization = ? ORDER BY rowid`).all(me(req).organization) as VRow[];
  res.json({ volunteers: rows.map(ngoVolunteerDto) });
});

ngoRouter.patch('/volunteers/:id', (req, res) => {
  const user = me(req);
  const b = parse(z.object({ assignedCamp: str(2, 150), currentTask: str(1, 200) }), req.body);
  const id = String(req.params.id);
  const r = db
    .prepare(`UPDATE ngo_volunteers SET assigned_camp = ?, current_task = ?, status = 'On Field' WHERE id = ? AND organization = ?`)
    .run(b.assignedCamp, b.currentTask, id, user.organization);
  if (r.changes === 0) throw notFound('Volunteer not found.');
  audit(user, 'NGO_VOLUNTEER_REDEPLOYED', 'ngo_volunteer', id, b);
  const row = db.prepare(`SELECT * FROM ngo_volunteers WHERE id = ?`).get(id) as VRow;
  res.json({ volunteer: ngoVolunteerDto(row), message: `Volunteer redeployed to ${b.assignedCamp}.` });
});

ngoRouter.get('/camps', (req, res) => {
  const rows = db.prepare(`SELECT * FROM ngo_camps WHERE ngo_name = ? ORDER BY rowid`).all(me(req).organization) as Parameters<
    typeof ngoCampDto
  >[0][];
  res.json({ camps: rows.map(ngoCampDto) });
});
