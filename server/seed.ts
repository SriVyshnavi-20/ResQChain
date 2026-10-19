import { config } from './config';
import type { DB } from './db';
import { minutesAgoIso as ago } from './lib/time';

const j = JSON.stringify;

/**
 * Loads shared reference data on first start: relief shelters, disaster zones, partner agencies and
 * a few starter notices. It creates NO user accounts and NO requests: everyone registers themselves.
 */
export function seedIfEmpty(db: DB): void {
  const { n } = db.prepare(`SELECT COUNT(*) n FROM shelters`).get() as { n: number };
  if (n > 0) return;
  seedReferenceData(db);
  console.log('[seed] Loaded starter shelters, disaster zones and agencies. No accounts exist yet: register at /register.');
}

export function seedReferenceData(db: DB): void {
  db.transaction(() => {
    const insShelter = db.prepare(
      `INSERT INTO shelters (id, name, address, zone, distance_km, capacity, occupancy, resources, contact_phone, lat, lng)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    insShelter.run('sh-red-cross', 'Red Cross Shelter Hub #1', '14 Gandhi Road, Central Sector, Chennai', 'Central District', 1.2, 100, 50, j(['Food', 'Water', 'Medical']), '+91 44 2815 1104', 13.0827, 80.2707);
    insShelter.run('sh-community-hall', 'Community Hall Relief Shelter', 'Cathedral Road, Teynampet, Chennai', 'South Sector', 2.4, 80, 39, j(['Food', 'Water']), '+91 44 2499 8830', 13.045, 80.25);
    insShelter.run('sh-govt-school', 'Govt School Relief Camp', 'Kutchery Road, Mylapore, Chennai', 'South-East Sector', 3.1, 120, 40, j(['Water', 'Medical']), '+91 44 2464 1212', 13.033, 80.268);
    insShelter.run('sh-anna-nagar', 'Anna Nagar Relief Camp', 'Anna Nagar West, Near Metro Gate 2, Chennai', 'Anna Nagar, Chennai', 1.2, 200, 114, j(['Food', 'Water', 'Medical', 'Clothing']), '+91 44 2621 5590', 13.085, 80.21);

    const insAnn = db.prepare(`INSERT INTO announcements (id, title, message, type, zone, issued_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    insAnn.run('ann-1', 'RED ALERT', 'Riverside Zone: Relief NGOs requested to coordinate hot meal distribution and drinking water supply.', 'emergency', 'Riverside Zone', 'TNSDMA Emergency Operations Center', ago(10));
    insAnn.run('ann-2', 'FLASH FLOOD', 'Downtown Sector: Low-lying causeways submerged. NGOs requested to station emergency dry blankets.', 'warning', 'Downtown', 'Regional Meteorological Centre', ago(25));
    insAnn.run('ann-3', 'RELIEF CENTER ACTIVE', 'Central District Hub #1 operational with food kitchen, doctor triage, and 1,240 bed capacity.', 'info', 'Central District', 'Red Cross Relief Unit', ago(60));

    const insZone = db.prepare(
      `INSERT INTO disaster_zones (id, name, disaster_type, severity, affected_areas, affected_population, evacuated_count, active_teams, status, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    insZone.run('DIS-01', 'Adyar River Basin Flood Inundation', 'Flood', 'Critical (Red Alert)', j(['Riverside Road', 'Saidapet Lowland', 'Kotturpuram Causeway']), 18400, 14200, 'NDRF 04 Battalion & Youth Rescue Brigade', 'Active Crisis', ago(10));
    insZone.run('DIS-02', 'Marina Coastal Cyclone Surge', 'Cyclone', 'High (Orange Alert)', j(['Marina Foreshore', 'Pattinapakkam Coastal Belt']), 9200, 7800, 'State Police Coastal QRT & Coast Guard', 'Containment in Progress', ago(25));
    insZone.run('DIS-03', 'Downtown Substation Fire Hazard', 'Fire', 'Medium (Yellow Alert)', j(['Downtown Substation Sector 4']), 3400, 3100, 'TN Fire & Rescue Services Station 12', 'Standby / Under Watch', ago(60));

    const insAgy = db.prepare(
      `INSERT INTO gov_agencies (id, name, type, command_lead, active_personnel, assigned_sector, status) VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    insAgy.run('AGY-01', 'NDRF 04 Battalion (Arakkonam Command)', 'Armed Forces / NDRF', 'Commandant S. K. Verma', 240, 'Adyar River Basin', 'Deployed');
    insAgy.run('AGY-02', 'Red Cross Disaster Relief Foundation', 'NGO Partner', 'Dr. Priya Sundaram', 120, 'Central & South Sector Hubs', 'Deployed');
    insAgy.run('AGY-03', 'Youth Rescue Brigade Taskforce', 'NGO Partner', 'V. Vasu / Priya Nair', 85, 'Riverside Lowland Causeway', 'Deployed');
    insAgy.run('AGY-04', 'Chennai City Police Coastal QRT', 'State Police', 'DCP R. Natarajan', 180, 'Marina Coastal Belt', 'Deployed');
    insAgy.run('AGY-05', 'State Medical Emergency Corps', 'Medical Corps', 'Dr. K. Swaminathan', 90, 'Central District Relief Hub', 'Standby');
  })();
}

// `npm run seed` -> WIPE everything (including all accounts) and reload only the starter reference data.
if (process.argv[1] && /seed\.(ts|js)$/.test(process.argv[1])) {
  const { db, resetDatabase } = await import('./db');
  resetDatabase();
  seedReferenceData(db);
  console.log(`Database reset: ${config.dbPath}\nAll accounts and requests were deleted. Register new accounts at /register.`);
}
