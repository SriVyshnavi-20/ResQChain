import { db } from '../db';
import { nowIso } from './time';
import type { AuthUser } from './auth';

const stmt = db.prepare(
  `INSERT INTO audit_log (actor_id, actor_name, actor_role, action, entity_type, entity_id, details, created_at)
   VALUES (@actor_id, @actor_name, @actor_role, @action, @entity_type, @entity_id, @details, @created_at)`
);

export function audit(
  actor: Pick<AuthUser, 'id' | 'name' | 'role'> | null,
  action: string,
  entityType?: string,
  entityId?: string | number,
  details?: unknown
): void {
  stmt.run({
    actor_id: actor?.id ?? null,
    actor_name: actor?.name ?? null,
    actor_role: actor?.role ?? null,
    action,
    entity_type: entityType ?? null,
    entity_id: entityId != null ? String(entityId) : null,
    details: details === undefined ? null : typeof details === 'string' ? details : JSON.stringify(details),
    created_at: nowIso()
  });
}
