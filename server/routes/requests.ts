import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { audit } from '../lib/audit';
import { me, requireAuth, requireRole } from '../lib/auth';
import { conflict, forbidden, notFound } from '../lib/errors';
import type { InventoryRow, RequestRow } from '../lib/rows';
import { requestDto } from '../lib/serialize';
import { nowIso } from '../lib/time';
import { categories, disasterTypes, optStr, parse, str, urgencies } from '../lib/validate';
import {
  cancelRequest,
  createPoolAssignment,
  createRequest,
  getRequest,
  isFinal,
  markEnroute,
  markMatched,
  recordEvent,
  resolveRequest
} from '../services/requests';
import { consumeSupplies } from '../services/supplies';
import { requestsFor } from './bootstrap';

export const requestsRouter = Router();
requestsRouter.use(requireAuth);

function load(id: string): RequestRow {
  const r = getRequest(id);
  if (!r) throw notFound(`Request ${id} was not found.`);
  return r;
}
const out = (id: string) => requestDto(getRequest(id)!);

requestsRouter.get('/', (req, res) => res.json({ requests: requestsFor(me(req)) }));

requestsRouter.get('/:id', (req, res) => {
  const user = me(req);
  const r = load(String(req.params.id));
  if (user.role === 'Victim' && r.victim_id !== user.id) throw notFound(`Request ${r.id} was not found.`);
  if (user.role === 'Volunteer') throw forbidden();
  res.json({ request: requestDto(r) });
});

const createSchema = z.object({
  disasterType: z.enum(disasterTypes),
  category: z.enum(categories),
  urgency: z.enum(urgencies),
  location: str(2, 300),
  details: str(3, 2000),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional()
});

const peopleFromFamily = (s: string | null) => Math.max(1, parseInt(s ?? '', 10) || 1);

requestsRouter.post('/', requireRole('Victim'), (req, res) => {
  const user = me(req);
  const b = parse(createSchema, req.body);
  const row = db.transaction(() =>
    createRequest({
      victimId: user.id,
      victimName: user.name,
      phone: user.phone,
      location: b.location,
      category: b.category,
      disasterType: b.disasterType,
      urgency: b.urgency,
      details: b.details,
      peopleCount: peopleFromFamily(user.family_size),
      latitude: b.latitude,
      longitude: b.longitude
    })
  )();
  audit(user, 'REQUEST_CREATED', 'request', row.id);
  res.status(201).json({ request: requestDto(row), message: `Request ${row.id} logged on public ledger!` });
});

requestsRouter.post('/:id/cancel', requireRole('Victim'), (req, res) => {
  const user = me(req);
  const r = load(String(req.params.id));
  if (r.victim_id !== user.id) throw notFound(`Request ${r.id} was not found.`);
  if (isFinal(r)) throw conflict('This request is already finalized.');
  db.transaction(() => cancelRequest(r.id))();
  audit(user, 'REQUEST_CANCELLED', 'request', r.id);
  res.json({ request: out(r.id), message: `Request ${r.id} has been cancelled.` });
});

/* ------------------------------ NGO / Government ------------------------------ */

const fulfillSchema = z.object({ note: optStr(500) });

requestsRouter.post('/:id/fulfill', requireRole('NGO', 'Government Official'), (req, res) => {
  const user = me(req);
  const { note } = parse(fulfillSchema, req.body ?? {});
  const r = load(String(req.params.id));
  if (isFinal(r)) throw conflict(`Request ${r.id} is already ${r.status.toLowerCase()}.`);

  db.transaction(() => {
    if (user.role === 'NGO') {
      // Only draw stock if a consignment wasn't already dispatched for this request.
      const already = db
        .prepare(`SELECT 1 FROM dispatch_log WHERE request_id = ? AND organization = ? AND kind = 'DISPATCH'`)
        .get(r.id, user.organization);
      if (!already) consumeSupplies(user, r);
      resolveRequest(r.id, {
        assignedTo: `${user.organization} (${user.name})`,
        extra: { title: 'Relief Consignment Delivered', subtitle: note || `Relief delivered by ${user.organization}` },
        subtitle: 'Assistance fulfilled and verified by NGO'
      });
    } else {
      const placeholder = !r.assigned_to || /^(unassigned|dispatching|pending)/i.test(r.assigned_to);
      resolveRequest(r.id, {
        assignedTo: placeholder ? 'State Disaster Management Authority' : r.assigned_to,
        subtitle: note || 'Resolved and closed under SDMA executive supervision.'
      });
    }
  })();
  audit(user, 'REQUEST_FULFILLED', 'request', r.id, note);
  res.json({ request: out(r.id), message: `Request ${r.id} marked as FULFILLED! Relief recorded.` });
});

requestsRouter.post('/:id/escalate', requireRole('Government Official'), (req, res) => {
  const user = me(req);
  const r = load(String(req.params.id));
  if (isFinal(r)) throw conflict(`Request ${r.id} is already ${r.status.toLowerCase()}.`);
  const unit = 'NDRF 04 Battalion Quick Strike Team';
  if (r.assigned_to === unit) throw conflict(`Ticket ${r.id} has already been escalated to NDRF.`);

  db.transaction(() => {
    recordEvent(r.id, 'Escalated to NDRF Command', `Authorized by ${user.designation || 'State Command'} (${user.name})`);
    markMatched(r.id, { assignedTo: unit, subtitle: 'NDRF Quick Strike Team assigned' });
    db.prepare(`UPDATE requests SET urgency = 'Critical', updated_at = ? WHERE id = ?`).run(nowIso(), r.id);
  })();
  audit(user, 'REQUEST_ESCALATED_NDRF', 'request', r.id);
  res.json({ request: out(r.id), message: `Ticket ${r.id} ESCALATED TO NDRF QUICK STRIKE FORCE!` });
});

requestsRouter.post('/:id/route-ngo', requireRole('Government Official'), (req, res) => {
  const user = me(req);
  const r = load(String(req.params.id));
  if (isFinal(r)) throw conflict(`Request ${r.id} is already ${r.status.toLowerCase()}.`);
  const partner = db.prepare(`SELECT name FROM gov_agencies WHERE type = 'NGO Partner' ORDER BY rowid LIMIT 1`).get() as
    | { name: string }
    | undefined;
  const org = partner?.name ?? 'Red Cross Disaster Relief Foundation';
  if (r.assigned_to === org) throw conflict(`Request ${r.id} is already routed to ${org}.`);

  db.transaction(() => {
    recordEvent(r.id, 'Routed to NGO Partner', `Routed to ${org} by ${user.name}`);
    markMatched(r.id, { assignedTo: org, subtitle: `Relief partner assigned (${org})` });
  })();
  audit(user, 'REQUEST_ROUTED_NGO', 'request', r.id, org);
  res.json({ request: out(r.id), message: `Request ${r.id} routed to ${org}.` });
});

requestsRouter.post('/:id/dispatch-supplies', requireRole('NGO'), (req, res) => {
  const user = me(req);
  const r = load(String(req.params.id));
  if (isFinal(r)) throw conflict(`Request ${r.id} is already ${r.status.toLowerCase()}.`);
  if (r.category === 'Rescue') throw conflict('Rescue requests need a field team, not a supply consignment.');

  const result = db.transaction(() => {
    const used = consumeSupplies(user, r);
    if (!used.length) throw conflict('No matching supplies are in stock. Restock inventory before dispatching.');
    const summary = used.map((u) => `${u.amount} ${u.unit} of ${u.name}`).join(', ');
    recordEvent(r.id, 'Supply Consignment Dispatched', `${summary} dispatched by ${user.organization}`);
    markMatched(r.id, { assignedTo: user.organization ?? 'NGO Relief Unit', subtitle: `Supplies allocated by ${user.organization}` });
    markEnroute(r.id, 'Supply consignment is on the way');
    return used;
  })();
  const hub = result[0]?.campLocation ?? 'Central Hub';
  audit(user, 'SUPPLIES_DISPATCHED', 'request', r.id, result);
  res.json({ request: out(r.id), message: `Emergency supply consignment dispatched from ${hub} to ${r.location}.` });
});

requestsRouter.post('/:id/deploy-volunteers', requireRole('NGO'), (req, res) => {
  const user = me(req);
  const r = load(String(req.params.id));
  if (isFinal(r)) throw conflict(`Request ${r.id} is already ${r.status.toLowerCase()}.`);

  const created = db.transaction(() => {
    const a = createPoolAssignment(r);
    if (a) recordEvent(r.id, 'Volunteer Squad Requested', `Dispatched to the volunteer pool by ${user.organization}`);
    return a;
  })();
  if (!created) throw conflict(`A volunteer squad has already been requested for ${r.id}.`);
  audit(user, 'VOLUNTEERS_DEPLOYED', 'request', r.id);
  res.json({ request: out(r.id), message: `Dispatched field volunteer squad to assist ${r.victim_name}.` });
});

export type { InventoryRow };
