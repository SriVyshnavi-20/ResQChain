import { db } from '../db';
import { nowIso } from '../lib/time';
import type { InventoryRow, RequestRow, UserRow } from '../lib/rows';

const CATEGORY_MAP: Record<RequestRow['category'], InventoryRow['category'][]> = {
  'Food & Water': ['Food', 'Water'],
  Medical: ['Medical'],
  Shelter: ['Shelter'],
  Supplies: ['Shelter'],
  Rescue: []
};

export interface UsedSupply {
  name: string;
  unit: string;
  amount: number;
  campLocation: string;
}

/**
 * Draws relief stock for a request from the NGO's largest matching inventory lines and logs it.
 * Best-effort: takes what is available (never goes negative). Call inside a transaction.
 */
export function consumeSupplies(user: UserRow, req: RequestRow): UsedSupply[] {
  const used: UsedSupply[] = [];
  for (const cat of CATEGORY_MAP[req.category]) {
    const item = db
      .prepare(`SELECT * FROM inventory WHERE organization = ? AND category = ? AND quantity > 0 ORDER BY quantity DESC LIMIT 1`)
      .get(user.organization, cat) as InventoryRow | undefined;
    if (!item) continue;
    const want = req.category === 'Medical' ? 1 : Math.max(1, req.people_count);
    const amount = Math.min(want, item.quantity);
    db.prepare(`UPDATE inventory SET quantity = quantity - ? WHERE id = ?`).run(amount, item.id);
    db.prepare(
      `INSERT INTO dispatch_log (organization, supply_id, category, kind, amount, request_id, actor_id, note, created_at)
       VALUES (?, ?, ?, 'DISPATCH', ?, ?, ?, ?, ?)`
    ).run(user.organization, item.id, item.category, amount, req.id, user.id, `Relief for ${req.id}`, nowIso());
    used.push({ name: item.name, unit: item.unit, amount, campLocation: item.camp_location });
  }
  return used;
}
