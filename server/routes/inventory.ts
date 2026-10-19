import { Router } from 'express';
import { z } from 'zod';
import { db, nextId } from '../db';
import { audit } from '../lib/audit';
import { me, requireRole } from '../lib/auth';
import { conflict, notFound } from '../lib/errors';
import type { InventoryRow } from '../lib/rows';
import { inventoryDto } from '../lib/serialize';
import { nowIso } from '../lib/time';
import { parse, str } from '../lib/validate';

export const inventoryRouter = Router();
inventoryRouter.use(requireRole('NGO'));

const load = (id: string, org: string | null) => {
  const i = db.prepare(`SELECT * FROM inventory WHERE id = ? AND organization = ?`).get(id, org) as InventoryRow | undefined;
  if (!i) throw notFound('Inventory item not found.');
  return i;
};

inventoryRouter.get('/', (req, res) => {
  const rows = db.prepare(`SELECT * FROM inventory WHERE organization = ? ORDER BY rowid DESC`).all(me(req).organization) as InventoryRow[];
  res.json({ inventory: rows.map(inventoryDto) });
});

const addSchema = z.object({
  name: str(2, 120),
  category: z.enum(['Food', 'Water', 'Medical', 'Shelter', 'Sanitation']),
  quantity: z.number().int().min(0).max(10_000_000),
  unit: str(1, 30),
  minThreshold: z.number().int().min(0).max(10_000_000),
  campLocation: str(2, 150)
});

inventoryRouter.post('/', (req, res) => {
  const user = me(req);
  const b = parse(addSchema, req.body);
  const id = nextId('SUP');
  db.prepare(
    `INSERT INTO inventory (id, organization, name, category, quantity, unit, min_threshold, camp_location, last_restocked_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, user.organization, b.name, b.category, b.quantity, b.unit, b.minThreshold, b.campLocation, nowIso());
  audit(user, 'SUPPLY_ADDED', 'inventory', id);
  res.status(201).json({ item: inventoryDto(load(id, user.organization)), message: `New supply item "${b.name}" registered in inventory.` });
});

const amountSchema = z.object({ amount: z.number().int().min(1).max(10_000_000) });

inventoryRouter.post('/:id/restock', (req, res) => {
  const user = me(req);
  const { amount } = parse(amountSchema, req.body);
  const item = load(String(req.params.id), user.organization);
  db.transaction(() => {
    db.prepare(`UPDATE inventory SET quantity = quantity + ?, last_restocked_at = ? WHERE id = ?`).run(amount, nowIso(), item.id);
    db.prepare(
      `INSERT INTO dispatch_log (organization, supply_id, category, kind, amount, actor_id, created_at) VALUES (?, ?, ?, 'RESTOCK', ?, ?, ?)`
    ).run(user.organization, item.id, item.category, amount, user.id, nowIso());
  })();
  audit(user, 'SUPPLY_RESTOCKED', 'inventory', item.id, { amount });
  res.json({ item: inventoryDto(load(item.id, user.organization)), message: `Restocked +${amount} units successfully!` });
});

inventoryRouter.post('/:id/dispatch', (req, res) => {
  const user = me(req);
  const { amount } = parse(amountSchema, req.body);
  const item = load(String(req.params.id), user.organization);
  db.transaction(() => {
    // Guarded update: never allows negative stock, even under concurrent dispatches.
    const r = db.prepare(`UPDATE inventory SET quantity = quantity - ? WHERE id = ? AND quantity >= ?`).run(amount, item.id, amount);
    if (r.changes === 0) throw conflict(`Insufficient stock: only ${item.quantity} ${item.unit} available.`);
    db.prepare(
      `INSERT INTO dispatch_log (organization, supply_id, category, kind, amount, actor_id, note, created_at) VALUES (?, ?, ?, 'DISPATCH', ?, ?, 'Field relief consignment', ?)`
    ).run(user.organization, item.id, item.category, amount, user.id, nowIso());
  })();
  audit(user, 'SUPPLY_DISPATCHED', 'inventory', item.id, { amount });
  res.json({ item: inventoryDto(load(item.id, user.organization)), message: `Dispatched ${amount} units for field relief consignment.` });
});
