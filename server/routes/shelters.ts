import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { audit } from '../lib/audit';
import { me, requireRole } from '../lib/auth';
import { conflict, notFound } from '../lib/errors';
import type { ShelterRow } from '../lib/rows';
import { listShelters, shelterDto } from '../lib/serialize';
import { nowIso } from '../lib/time';
import { parse } from '../lib/validate';

export const sheltersRouter = Router();

// Shelter availability is public safety information.
sheltersRouter.get('/', (_req, res) => res.json({ shelters: listShelters() }));

const load = (id: string) => {
  const s = db.prepare(`SELECT * FROM shelters WHERE id = ?`).get(id) as ShelterRow | undefined;
  if (!s) throw notFound('Shelter not found.');
  return s;
};

sheltersRouter.post('/:id/reserve', requireRole('Victim'), (req, res) => {
  const user = me(req);
  const id = String(req.params.id);
  const people = Math.max(1, parseInt(user.family_size ?? '', 10) || 1);

  db.transaction(() => {
    const shelter = load(id);
    const existing = db.prepare(`SELECT * FROM shelter_reservations WHERE user_id = ?`).get(user.id) as
      | { id: number; shelter_id: string; people: number }
      | undefined;
    if (existing?.shelter_id === id) throw conflict('You already hold a reservation at this shelter.');
    const free = shelter.capacity - shelter.occupancy;
    if (free < people) {
      throw conflict(free <= 0 ? 'This shelter is full.' : `Only ${free} space(s) left; your household needs ${people}.`);
    }
    // Moving to a different shelter releases the earlier reservation.
    if (existing) {
      db.prepare(`UPDATE shelters SET occupancy = MAX(0, occupancy - ?) WHERE id = ?`).run(existing.people, existing.shelter_id);
      db.prepare(`DELETE FROM shelter_reservations WHERE id = ?`).run(existing.id);
    }
    db.prepare(`UPDATE shelters SET occupancy = occupancy + ? WHERE id = ?`).run(people, id);
    db.prepare(`INSERT INTO shelter_reservations (shelter_id, user_id, people, created_at) VALUES (?, ?, ?, ?)`).run(
      id,
      user.id,
      people,
      nowIso()
    );
  })();

  audit(user, 'SHELTER_RESERVED', 'shelter', id, { people });
  res.json({ shelter: shelterDto(load(id)), message: 'Shelter reservation request confirmed! Proceed to shelter.' });
});

sheltersRouter.post('/:id/expand', requireRole('Government Official'), (req, res) => {
  const user = me(req);
  const { additionalSpace } = parse(z.object({ additionalSpace: z.number().int().min(1).max(10000) }), req.body);
  const s = load(String(req.params.id));
  db.prepare(`UPDATE shelters SET capacity = capacity + ? WHERE id = ?`).run(additionalSpace, s.id);
  audit(user, 'SHELTER_EXPANDED', 'shelter', s.id, { additionalSpace });
  res.json({ shelter: shelterDto(load(s.id)), message: `Shelter capacity expanded by +${additionalSpace} emergency beds!` });
});

sheltersRouter.post('/:id/audit', requireRole('Government Official'), (req, res) => {
  const user = me(req);
  const s = load(String(req.params.id));
  db.prepare(`UPDATE shelters SET last_audit_at = ?, last_audit_by = ? WHERE id = ?`).run(nowIso(), user.name, s.id);
  audit(user, 'SHELTER_AUDIT_CLEARED', 'shelter', s.id);
  res.json({ shelter: shelterDto(load(s.id)), message: `Disaster Safety & Food Hygiene audit cleared for ${s.name}.` });
});
