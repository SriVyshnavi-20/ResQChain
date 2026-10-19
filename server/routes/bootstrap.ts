import { Router } from 'express';
import { db } from '../db';
import { me, requireAuth } from '../lib/auth';
import type { AssignmentRow, InventoryRow, RequestRow } from '../lib/rows';
import {
  agencyDto,
  announcementDto,
  assignmentDto,
  inventoryDto,
  listShelters,
  ngoCampDto,
  ngoVolunteerDto,
  requestDto,
  userDto,
  volunteerTaskDto,
  zoneDto
} from '../lib/serialize';
import { computeStats } from '../services/stats';

export const bootstrapRouter = Router();

export function listAnnouncements() {
  const rows = db.prepare(`SELECT * FROM announcements ORDER BY created_at DESC, rowid DESC LIMIT 100`).all() as Parameters<
    typeof announcementDto
  >[0][];
  return rows.map(announcementDto);
}

export function requestsFor(user: ReturnType<typeof me>) {
  let rows: RequestRow[] = [];
  if (user.role === 'Victim') {
    rows = db.prepare(`SELECT * FROM requests WHERE victim_id = ? ORDER BY created_at DESC, rowid DESC`).all(user.id) as RequestRow[];
  } else if (user.role === 'NGO' || user.role === 'Government Official') {
    rows = db.prepare(`SELECT * FROM requests ORDER BY created_at DESC, rowid DESC`).all() as RequestRow[];
  }
  return rows.map(requestDto);
}

export function assignmentsFor(userId: number) {
  const rows = db
    .prepare(
      `SELECT * FROM assignments a
       WHERE a.volunteer_id = @uid
          OR (a.status = 'Pending' AND NOT EXISTS (
                SELECT 1 FROM assignment_declines d WHERE d.assignment_id = a.id AND d.volunteer_id = @uid))
       ORDER BY a.created_at DESC, a.rowid DESC`
    )
    .all({ uid: userId }) as AssignmentRow[];
  return rows.map(assignmentDto);
}

/** Everything the signed-in role needs to render the app, in a single round trip. */
bootstrapRouter.get('/', requireAuth, (req, res) => {
  const user = me(req);
  const isVol = user.role === 'Volunteer';
  const isNgo = user.role === 'NGO';
  const isGov = user.role === 'Government Official';

  const inventory = isNgo
    ? (db.prepare(`SELECT * FROM inventory WHERE organization = ? ORDER BY rowid DESC`).all(user.organization) as InventoryRow[]).map(inventoryDto)
    : [];

  res.json({
    user: userDto(user),
    requests: requestsFor(user),
    shelters: listShelters(),
    announcements: listAnnouncements(),
    assignments: isVol ? assignmentsFor(user.id) : [],
    volunteerTasks: isVol
      ? (db.prepare(`SELECT * FROM volunteer_tasks ORDER BY rowid`).all() as Parameters<typeof volunteerTaskDto>[0][]).map(volunteerTaskDto)
      : [],
    inventory,
    ngoVolunteers: isNgo
      ? (db.prepare(`SELECT * FROM ngo_volunteers WHERE organization = ? ORDER BY rowid`).all(user.organization) as Parameters<typeof ngoVolunteerDto>[0][]).map(ngoVolunteerDto)
      : [],
    ngoCamps: isNgo
      ? (db.prepare(`SELECT * FROM ngo_camps WHERE ngo_name = ? ORDER BY rowid`).all(user.organization) as Parameters<typeof ngoCampDto>[0][]).map(ngoCampDto)
      : [],
    disasterZones: isGov
      ? (db.prepare(`SELECT * FROM disaster_zones ORDER BY rowid`).all() as Parameters<typeof zoneDto>[0][]).map(zoneDto)
      : [],
    govAgencies: isGov
      ? (db.prepare(`SELECT * FROM gov_agencies ORDER BY rowid`).all() as Parameters<typeof agencyDto>[0][]).map(agencyDto)
      : [],
    stats: computeStats(user)
  });
});
