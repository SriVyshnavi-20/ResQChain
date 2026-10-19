import { db, nextId } from '../db';
import { nowIso } from '../lib/time';
import {
  STEP,
  addEvent,
  completeStep,
  initialTimeline,
  parseTimeline,
  startStep,
  type StoredEvent
} from '../lib/timeline';
import type { AssignmentRow, RequestRow } from '../lib/rows';

export const EMERGENCY_TYPE: Record<RequestRow['category'], string> = {
  Medical: 'Medical Assistance',
  Rescue: 'Rescue Assistance',
  'Food & Water': 'Food & Water',
  Shelter: 'Shelter Assistance',
  Supplies: 'Supplies Delivery'
};

/**
 * Placeholder proximity until real geolocation matching is added: a stable value in
 * [0.4, 3.9] km derived from the request id, so the same request always shows the same distance.
 */
export function pseudoDistanceKm(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return Math.round((0.4 + (h % 36) / 10) * 10) / 10;
}

export const getRequest = (id: string) =>
  db.prepare(`SELECT * FROM requests WHERE id = ?`).get(id) as RequestRow | undefined;

function writeTimeline(id: string, tl: StoredEvent[], extra: Record<string, unknown> = {}) {
  const sets = ['timeline = @timeline', 'updated_at = @updated_at'];
  for (const k of Object.keys(extra)) sets.push(`${k} = @${k}`);
  db.prepare(`UPDATE requests SET ${sets.join(', ')} WHERE id = @id`).run({
    id,
    timeline: JSON.stringify(tl),
    updated_at: nowIso(),
    ...extra
  });
}

export interface NewRequestInput {
  victimId: number | null;
  victimName: string;
  phone: string | null;
  location: string;
  category: RequestRow['category'];
  disasterType: string;
  urgency: RequestRow['urgency'];
  details: string;
  peopleCount: number;
  latitude?: number | null;
  longitude?: number | null;
  source?: 'app' | 'sos';
  sosId?: string | null;
  title?: string;
}

/** Creates a request and publishes it to the volunteer dispatch pool. */
export function createRequest(input: NewRequestInput): RequestRow {
  const now = nowIso();
  const id = nextId('REQ');
  const tl = initialTimeline(
    now,
    input.source === 'sos' ? 'SOS beacon received and broadcast to responders' : 'Timestamped and logged on public ledger'
  );

  db.prepare(
    `INSERT INTO requests (id, victim_id, request_title, category, disaster_type, urgency, status, victim_name, location, phone,
       details, assigned_to, people_count, latitude, longitude, source, sos_id, timeline, created_at, updated_at)
     VALUES (@id, @victim_id, @title, @category, @disaster_type, @urgency, 'Open', @victim_name, @location, @phone,
       @details, 'Dispatching...', @people_count, @latitude, @longitude, @source, @sos_id, @timeline, @now, @now)`
  ).run({
    id,
    victim_id: input.victimId,
    title: input.title ?? `${input.category} (${input.disasterType})`,
    category: input.category,
    disaster_type: input.disasterType,
    urgency: input.urgency,
    victim_name: input.victimName,
    location: input.location,
    phone: input.phone,
    details: input.details,
    people_count: Math.max(1, input.peopleCount),
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    source: input.source ?? 'app',
    sos_id: input.sosId ?? null,
    timeline: JSON.stringify(tl),
    now
  });

  const row = getRequest(id)!;
  createPoolAssignment(row);
  return row;
}

/** Puts a request in the volunteer pool (idempotent). Returns null when one already exists. */
export function createPoolAssignment(req: RequestRow): AssignmentRow | null {
  const existing = db.prepare(`SELECT id FROM assignments WHERE id = ?`).get(req.id);
  if (existing) return null;
  db.prepare(
    `INSERT INTO assignments (id, request_id, emergency_type, location, distance_km, severity, status, requester, notes, people_count, created_at)
     VALUES (@id, @request_id, @emergency_type, @location, @distance_km, @severity, 'Pending', @requester, @notes, @people_count, @created_at)`
  ).run({
    id: req.id,
    request_id: req.id,
    emergency_type: EMERGENCY_TYPE[req.category],
    location: req.location,
    distance_km: pseudoDistanceKm(req.id),
    severity: req.urgency,
    requester: req.source === 'sos' ? `${req.victim_name} (SOS Beacon)` : req.victim_name,
    notes: req.details,
    people_count: req.people_count,
    created_at: nowIso()
  });
  return db.prepare(`SELECT * FROM assignments WHERE id = ?`).get(req.id) as AssignmentRow;
}

/** A responder (volunteer / NGO / agency) has been matched to the request. */
export function markMatched(
  id: string,
  opts: { assignedTo: string; phone?: string | null; subtitle: string }
): void {
  const req = getRequest(id);
  if (!req || req.status === 'Resolved' || req.status === 'Cancelled') return;
  const at = nowIso();
  const tl = parseTimeline(req.timeline);
  completeStep(tl, STEP.matched, opts.subtitle, at);
  writeTimeline(id, tl, {
    status: req.status === 'Open' ? 'Matched' : req.status,
    assigned_to: opts.assignedTo,
    assigned_responder_phone: opts.phone ?? req.assigned_responder_phone,
    matched_at: req.matched_at ?? at
  });
}

export function markEnroute(id: string, subtitle: string): void {
  const req = getRequest(id);
  if (!req || req.status === 'Resolved' || req.status === 'Cancelled') return;
  const at = nowIso();
  const tl = parseTimeline(req.timeline);
  completeStep(tl, STEP.matched, 'Responder assigned', at);
  startStep(tl, STEP.enroute, subtitle, at);
  writeTimeline(id, tl, { status: 'Enroute', matched_at: req.matched_at ?? at });
}

/** Adds a completed, non-standard event to the timeline (e.g. escalation, consignment dispatched). */
export function recordEvent(id: string, title: string, subtitle: string): void {
  const req = getRequest(id);
  if (!req) return;
  const tl = parseTimeline(req.timeline);
  addEvent(tl, { title, subtitle, at: nowIso() });
  writeTimeline(id, tl);
}

export function resolveRequest(
  id: string,
  opts: { assignedTo?: string | null; extra?: { title: string; subtitle: string }; subtitle: string }
): void {
  const req = getRequest(id);
  if (!req) return;
  const at = nowIso();
  const tl = parseTimeline(req.timeline);
  completeStep(tl, STEP.matched, 'Assistance arranged by relief command', at);
  completeStep(tl, STEP.enroute, 'Relief delivered to the location', at);
  if (opts.extra) addEvent(tl, { ...opts.extra, at }, { before: STEP.resolved });
  completeStep(tl, STEP.resolved, opts.subtitle, at);
  writeTimeline(id, tl, {
    status: 'Resolved',
    assigned_to: opts.assignedTo ?? req.assigned_to,
    matched_at: req.matched_at ?? at,
    resolved_at: at
  });
  closeLinkedAssignments(id, 'Request resolved by relief command.');
}

export function cancelRequest(id: string): void {
  const req = getRequest(id);
  if (!req) return;
  const tl = parseTimeline(req.timeline);
  addEvent(tl, { title: 'Request Cancelled', subtitle: 'Cancelled by victim', at: nowIso() }, 'end');
  writeTimeline(id, tl, { status: 'Cancelled' });
  closeLinkedAssignments(id, 'Request cancelled by the citizen.');
}

/**
 * When a request is finalised by someone else, withdraw its unclaimed pool entry and close any
 * claimed one so volunteers don't keep working a closed ticket.
 */
export function closeLinkedAssignments(requestId: string, reason: string): void {
  const now = nowIso();
  db.prepare(`DELETE FROM assignments WHERE request_id = ? AND status = 'Pending'`).run(requestId);
  db.prepare(
    `UPDATE assignments SET status = 'Completed', completed_at = ?, notes = notes || ?
     WHERE request_id = ? AND status IN ('Accepted','Enroute')`
  ).run(now, ` [Closed: ${reason}]`, requestId);
}

export const isFinal = (r: Pick<RequestRow, 'status'>) => r.status === 'Resolved' || r.status === 'Cancelled';
