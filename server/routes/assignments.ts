import { Router } from 'express';
import { db } from '../db';
import { audit } from '../lib/audit';
import { me, requireRole } from '../lib/auth';
import { conflict, forbidden, notFound } from '../lib/errors';
import type { AssignmentRow } from '../lib/rows';
import { assignmentDto } from '../lib/serialize';
import { nowIso } from '../lib/time';
import { markEnroute, markMatched, resolveRequest } from '../services/requests';
import { assignmentsFor } from './bootstrap';

export const assignmentsRouter = Router();
assignmentsRouter.use(requireRole('Volunteer'));

const load = (id: string) => {
  const a = db.prepare(`SELECT * FROM assignments WHERE id = ?`).get(id) as AssignmentRow | undefined;
  if (!a) throw notFound(`Assignment ${id} was not found.`);
  return a;
};
const dto = (id: string) => assignmentDto(load(id));

assignmentsRouter.get('/', (req, res) => res.json({ assignments: assignmentsFor(me(req).id) }));

assignmentsRouter.post('/:id/accept', (req, res) => {
  const user = me(req);
  const id = String(req.params.id);
  if (user.availability === 'OFFLINE') {
    throw conflict('You are OFFLINE. Switch to ACTIVE or STANDBY to accept assignments.');
  }
  db.transaction(() => {
    const a = load(id);
    if (a.status !== 'Pending') {
      throw conflict(a.volunteer_id === user.id ? 'You have already accepted this assignment.' : 'This assignment has already been claimed by another volunteer.');
    }
    // Atomic claim: only one volunteer can win.
    const res = db
      .prepare(`UPDATE assignments SET status = 'Accepted', volunteer_id = ?, accepted_at = ? WHERE id = ? AND status = 'Pending' AND volunteer_id IS NULL`)
      .run(user.id, nowIso(), id);
    if (res.changes === 0) throw conflict('This assignment has already been claimed by another volunteer.');
    if (a.request_id) {
      markMatched(a.request_id, {
        assignedTo: `${user.name} (${user.organization || 'Volunteer'})`,
        phone: user.phone,
        subtitle: `Relief responder assigned (${user.name})`
      });
    }
  })();
  audit(user, 'ASSIGNMENT_ACCEPTED', 'assignment', id);
  res.json({ assignment: dto(id), message: `Assignment ${id} ACCEPTED! Proceed to preparation.` });
});

function ownedIn(id: string, userId: number, status: AssignmentRow['status']): AssignmentRow {
  const a = load(id);
  if (a.volunteer_id !== userId) throw forbidden('This assignment belongs to another volunteer.');
  if (a.status !== status) throw conflict(`Assignment must be ${status} (it is currently ${a.status}).`);
  return a;
}

assignmentsRouter.post('/:id/start', (req, res) => {
  const user = me(req);
  const id = String(req.params.id);
  db.transaction(() => {
    const a = ownedIn(id, user.id, 'Accepted');
    db.prepare(`UPDATE assignments SET status = 'Enroute', started_at = ? WHERE id = ?`).run(nowIso(), id);
    if (a.request_id) markEnroute(a.request_id, `${user.name} is enroute to ${a.location}`);
  })();
  audit(user, 'ASSIGNMENT_STARTED', 'assignment', id);
  res.json({ assignment: dto(id), message: `Journey started for ${id}. GPS tracking activated.` });
});

assignmentsRouter.post('/:id/complete', (req, res) => {
  const user = me(req);
  const id = String(req.params.id);
  db.transaction(() => {
    const a = ownedIn(id, user.id, 'Enroute');
    db.prepare(`UPDATE assignments SET status = 'Completed', completed_at = ? WHERE id = ?`).run(nowIso(), id);
    db.prepare(`UPDATE users SET tasks_completed = tasks_completed + 1, people_assisted = people_assisted + ? WHERE id = ?`).run(
      a.people_count,
      user.id
    );
    if (a.request_id) {
      resolveRequest(a.request_id, { subtitle: `Assistance delivered and signed off by ${user.name}` });
    }
  })();
  audit(user, 'ASSIGNMENT_COMPLETED', 'assignment', id);
  res.json({ assignment: dto(id), message: `Assignment ${id} marked as COMPLETED! Great work.` });
});

// "Reject" hides a pending ticket for this volunteer only; it stays available to others.
assignmentsRouter.post('/:id/reject', (req, res) => {
  const user = me(req);
  const id = String(req.params.id);
  const a = load(id);
  if (a.status !== 'Pending') throw conflict('Only pending assignments can be declined.');
  db.prepare(`INSERT OR IGNORE INTO assignment_declines (assignment_id, volunteer_id) VALUES (?, ?)`).run(id, user.id);
  audit(user, 'ASSIGNMENT_DECLINED', 'assignment', id);
  res.json({ message: `Assignment ${id} declined.` });
});
