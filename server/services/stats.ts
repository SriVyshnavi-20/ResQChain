import type { DashboardStats } from '../../src/types';
import { db } from '../db';
import type { UserRow } from '../lib/rows';

const n = (sql: string, ...p: unknown[]) => (db.prepare(sql).get(...p) as { n: number }).n;

/** Aggregates behind the dashboard tiles. Scoped to the user where it makes sense. */
export function computeStats(user: UserRow): DashboardStats {
  const totalRequests = n(`SELECT COUNT(*) n FROM requests`);
  const resolvedCount = n(`SELECT COUNT(*) n FROM requests WHERE status = 'Resolved'`);
  const peopleHelped =
    user.role === 'Victim'
      ? n(`SELECT COALESCE(SUM(people_count),0) n FROM requests WHERE victim_id = ? AND status = 'Resolved'`, user.id)
      : n(`SELECT COALESCE(SUM(people_count),0) n FROM requests WHERE status = 'Resolved'`);

  return {
    openShelters: n(`SELECT COUNT(*) n FROM shelters WHERE capacity > occupancy`),
    totalShelters: n(`SELECT COUNT(*) n FROM shelters`),
    peopleHelped,
    incomingRequests: n(`SELECT COUNT(*) n FROM requests WHERE status IN ('Open','Matched')`),
    volunteersDeployed: user.organization
      ? n(`SELECT COUNT(*) n FROM ngo_volunteers WHERE organization = ? AND status = 'On Field'`, user.organization)
      : 0,
    distressCalls: totalRequests,
    zoneCount: n(`SELECT COUNT(*) n FROM disaster_zones`),
    resolvedCount,
    clearancePct: totalRequests ? Math.round((resolvedCount / totalRequests) * 1000) / 10 : 0,
    battalions: n(`SELECT COUNT(*) n FROM gov_agencies WHERE type IN ('Armed Forces / NDRF','State Police')`),
    ngoPartners: n(`SELECT COUNT(*) n FROM gov_agencies WHERE type = 'NGO Partner'`)
  };
}

export function landingStats() {
  const resolved = n(`SELECT COUNT(*) n FROM requests WHERE status = 'Resolved'`);
  const people = n(`SELECT COALESCE(SUM(people_count),0) n FROM requests WHERE status = 'Resolved'`);
  const volunteers = n(`SELECT COUNT(*) n FROM users WHERE role = 'Volunteer' AND availability = 'ACTIVE'`);
  const fmt = (v: number) => `${v.toLocaleString('en-IN')}+`;
  return { peopleHelped: fmt(people), requestsResolved: fmt(resolved), activeVolunteers: fmt(volunteers) };
}
