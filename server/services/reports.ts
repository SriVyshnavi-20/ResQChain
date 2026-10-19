import type { ReportSummary } from '../../src/types';
import { db } from '../db';
import { ago } from '../lib/time';

const n = (sql: string, ...p: unknown[]) => (db.prepare(sql).get(...p) as { n: number }).n;

const GROUPS: { key: string; name: string; categories: string[] }[] = [
  { key: 'food', name: 'Food & Drinking Water Rations', categories: ['Food & Water'] },
  { key: 'medical', name: 'Medical First Aid & Insulin Aid', categories: ['Medical'] },
  { key: 'rescue', name: 'Rescue & Flood Boat Evacuations', categories: ['Rescue'] },
  { key: 'shelter', name: 'Shelter Accommodation & Bedding', categories: ['Shelter', 'Supplies'] }
];

export function buildReportSummary(): ReportSummary {
  const total = n(`SELECT COUNT(*) n FROM requests`);
  const resolved = n(`SELECT COUNT(*) n FROM requests WHERE status = 'Resolved'`);

  // Share of non-cancelled Critical/High tickets that have a responder (matched, en route or resolved).
  const priority = n(`SELECT COUNT(*) n FROM requests WHERE urgency IN ('Critical','High') AND status != 'Cancelled'`);
  const covered = n(
    `SELECT COUNT(*) n FROM requests WHERE urgency IN ('Critical','High') AND status IN ('Matched','Enroute','Resolved')`
  );

  const resp = db
    .prepare(
      `SELECT AVG((julianday(matched_at) - julianday(created_at)) * 1440.0) AS m
       FROM requests WHERE matched_at IS NOT NULL`
    )
    .get() as { m: number | null };

  const categories = GROUPS.map((g) => {
    const placeholders = g.categories.map(() => '?').join(',');
    const count = n(`SELECT COUNT(*) n FROM requests WHERE category IN (${placeholders})`, ...g.categories);
    return { key: g.key, name: g.name, count, pct: total ? Math.round((count / total) * 100) : 0 };
  });

  const dispatched = (category: string) =>
    n(`SELECT COALESCE(SUM(amount),0) n FROM dispatch_log WHERE kind = 'DISPATCH' AND category = ?`, category);

  return {
    generatedAt: new Date().toISOString(),
    casualtiesAvertedPct: priority ? Math.round((covered / priority) * 1000) / 10 : 100,
    peopleAssisted: n(`SELECT COALESCE(SUM(evacuated_count),0) n FROM disaster_zones`),
    requestsResolved: resolved,
    requestsTotal: total,
    clearancePct: total ? Math.round((resolved / total) * 1000) / 10 : 0,
    avgResponseMinutes: resp.m == null ? 0 : Math.round(resp.m * 10) / 10,
    categories,
    logistics: {
      foodPacks: dispatched('Food'),
      waterLitres: dispatched('Water'),
      medicalKits: dispatched('Medical'),
      campCount: n(`SELECT COUNT(*) n FROM ngo_camps`)
    }
  };
}

export interface LedgerRow {
  id: string;
  title: string;
  category: string;
  urgency: string;
  status: string;
  victim: string;
  location: string;
  assignedTo: string;
  logged: string;
}

export function requestLedger(): LedgerRow[] {
  const rows = db
    .prepare(
      `SELECT id, request_title, category, urgency, status, victim_name, location, COALESCE(assigned_to,'') assigned_to, created_at
       FROM requests ORDER BY created_at DESC`
    )
    .all() as {
    id: string;
    request_title: string;
    category: string;
    urgency: string;
    status: string;
    victim_name: string;
    location: string;
    assigned_to: string;
    created_at: string;
  }[];
  return rows.map((r) => ({
    id: r.id,
    title: r.request_title,
    category: r.category,
    urgency: r.urgency,
    status: r.status,
    victim: r.victim_name,
    location: r.location,
    assignedTo: r.assigned_to,
    logged: new Date(r.created_at).toISOString()
  }));
}

export function activeZonesForReport() {
  return db
    .prepare(`SELECT name, disaster_type, severity, affected_population, evacuated_count, status, updated_at FROM disaster_zones ORDER BY rowid`)
    .all() as {
    name: string;
    disaster_type: string;
    severity: string;
    affected_population: number;
    evacuated_count: number;
    status: string;
    updated_at: string;
  }[];
}

export const zoneUpdatedAgo = ago;
