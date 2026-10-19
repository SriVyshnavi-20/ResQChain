import { Router } from 'express';
import { db } from '../db';
import { me, requireRole } from '../lib/auth';
import { conflict, forbidden, notFound } from '../lib/errors';
import { volunteerTaskDto } from '../lib/serialize';

export const volunteerTasksRouter = Router();
volunteerTasksRouter.use(requireRole('Volunteer'));

type Row = Parameters<typeof volunteerTaskDto>[0] & { volunteer_id: number | null };
const load = (id: string) => {
  const t = db.prepare(`SELECT * FROM volunteer_tasks WHERE id = ?`).get(id) as Row | undefined;
  if (!t) throw notFound('Task not found.');
  return t;
};

volunteerTasksRouter.get('/', (_req, res) => {
  const rows = db.prepare(`SELECT * FROM volunteer_tasks ORDER BY rowid`).all() as Row[];
  res.json({ tasks: rows.map(volunteerTaskDto) });
});

volunteerTasksRouter.post('/:id/claim', (req, res) => {
  const user = me(req);
  const t = load(String(req.params.id));
  const r = db
    .prepare(`UPDATE volunteer_tasks SET status = 'Claimed', volunteer_id = ?, assigned_volunteer = ? WHERE id = ? AND status = 'Open'`)
    .run(user.id, user.name, t.id);
  if (r.changes === 0) throw conflict('This task has already been claimed.');
  res.json({ task: volunteerTaskDto(load(t.id)), message: `Task ${t.id} claimed.` });
});

volunteerTasksRouter.post('/:id/complete', (req, res) => {
  const user = me(req);
  const t = load(String(req.params.id));
  if (t.volunteer_id !== user.id) throw forbidden('This task is not assigned to you.');
  if (t.status !== 'Claimed') throw conflict('Only claimed tasks can be completed.');
  db.prepare(`UPDATE volunteer_tasks SET status = 'Completed' WHERE id = ?`).run(t.id);
  db.prepare(`UPDATE users SET tasks_completed = tasks_completed + 1 WHERE id = ?`).run(user.id);
  res.json({ task: volunteerTaskDto(load(t.id)), message: `Task ${t.id} marked as completed.` });
});
