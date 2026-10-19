import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { config } from './config';

/* eslint-disable @typescript-eslint/no-explicit-any */
// Uses Node's built-in SQLite (node:sqlite, Node >= 22.13): no native modules to compile, which keeps
// `npm install` working on Windows machines without Visual Studio build tools.
export interface Stmt {
  get(...params: any[]): any;
  all(...params: any[]): any[];
  run(...params: any[]): { changes: number | bigint; lastInsertRowid: number | bigint };
}

export interface DB {
  prepare(sql: string): Stmt;
  exec(sql: string): void;
  pragma(statement: string): void;
  /** Wraps fn in a transaction (nested calls become savepoints). fn must be synchronous. */
  transaction<F extends (...args: any[]) => any>(fn: F): F;
  close(): void;
}

function wrap(raw: DatabaseSync): DB {
  let depth = 0;
  return {
    prepare: (sql) => raw.prepare(sql) as unknown as Stmt,
    exec: (sql) => raw.exec(sql),
    pragma: (statement) => raw.exec(`PRAGMA ${statement}`),
    close: () => raw.close(),
    transaction<F extends (...args: any[]) => any>(fn: F): F {
      return ((...args: any[]) => {
        const outer = depth === 0;
        const savepoint = `sp_${depth}`;
        raw.exec(outer ? 'BEGIN IMMEDIATE' : `SAVEPOINT ${savepoint}`);
        depth++;
        try {
          const result = fn(...args);
          depth--;
          raw.exec(outer ? 'COMMIT' : `RELEASE ${savepoint}`);
          return result;
        } catch (err) {
          depth--;
          if (outer) raw.exec('ROLLBACK');
          else raw.exec(`ROLLBACK TO ${savepoint}; RELEASE ${savepoint}`);
          throw err;
        }
      }) as F;
    }
  };
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  role                TEXT NOT NULL CHECK (role IN ('Victim','Volunteer','NGO','Government Official')),
  name                TEXT NOT NULL,
  email               TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash       TEXT NOT NULL,
  token_version       INTEGER NOT NULL DEFAULT 0,
  phone               TEXT,
  location            TEXT NOT NULL DEFAULT '',
  family_size         TEXT,
  need_type           TEXT,
  is_safe             INTEGER NOT NULL DEFAULT 0,
  preferences         TEXT NOT NULL DEFAULT '{}',
  zone                TEXT,
  shift               TEXT,
  skills              TEXT,
  availability        TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (availability IN ('ACTIVE','STANDBY','OFFLINE')),
  tasks_completed     INTEGER NOT NULL DEFAULT 0,
  people_assisted     INTEGER NOT NULL DEFAULT 0,
  rating              REAL,
  organization        TEXT,
  badge_number        TEXT,
  registration_number TEXT,
  coverage_zones      TEXT,
  designation         TEXT,
  department          TEXT,
  official_id         TEXT,
  jurisdiction        TEXT,
  avatar_url          TEXT,
  created_at          TEXT NOT NULL,
  updated_at          TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS password_resets (
  token_hash TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  used_at    TEXT
);

CREATE TABLE IF NOT EXISTS requests (
  id                       TEXT PRIMARY KEY,
  victim_id                INTEGER REFERENCES users(id) ON DELETE SET NULL,
  request_title            TEXT NOT NULL,
  category                 TEXT NOT NULL CHECK (category IN ('Medical','Rescue','Food & Water','Shelter','Supplies')),
  disaster_type            TEXT NOT NULL DEFAULT 'Other',
  urgency                  TEXT NOT NULL CHECK (urgency IN ('Critical','High','Medium','Low')),
  status                   TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open','Matched','Enroute','Resolved','Cancelled')),
  victim_name              TEXT NOT NULL,
  location                 TEXT NOT NULL,
  phone                    TEXT,
  details                  TEXT NOT NULL DEFAULT '',
  assigned_to              TEXT,
  assigned_responder_phone TEXT,
  people_count             INTEGER NOT NULL DEFAULT 1,
  latitude                 REAL,
  longitude                REAL,
  source                   TEXT NOT NULL DEFAULT 'app',
  sos_id                   TEXT,
  timeline                 TEXT NOT NULL DEFAULT '[]',
  created_at               TEXT NOT NULL,
  updated_at               TEXT NOT NULL,
  matched_at               TEXT,
  resolved_at              TEXT
);
CREATE INDEX IF NOT EXISTS idx_requests_victim ON requests(victim_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created ON requests(created_at);

CREATE TABLE IF NOT EXISTS assignments (
  id             TEXT PRIMARY KEY,
  request_id     TEXT REFERENCES requests(id) ON DELETE CASCADE,
  emergency_type TEXT NOT NULL,
  location       TEXT NOT NULL,
  distance_km    REAL NOT NULL DEFAULT 1,
  severity       TEXT NOT NULL CHECK (severity IN ('Critical','High','Medium','Low')),
  status         TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','Accepted','Enroute','Completed')),
  requester      TEXT NOT NULL,
  notes          TEXT NOT NULL DEFAULT '',
  people_count   INTEGER NOT NULL DEFAULT 3,
  volunteer_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at     TEXT NOT NULL,
  accepted_at    TEXT,
  started_at     TEXT,
  completed_at   TEXT
);
CREATE INDEX IF NOT EXISTS idx_assignments_volunteer ON assignments(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);

CREATE TABLE IF NOT EXISTS assignment_declines (
  assignment_id TEXT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  volunteer_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (assignment_id, volunteer_id)
);

CREATE TABLE IF NOT EXISTS shelters (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  address       TEXT NOT NULL,
  zone          TEXT NOT NULL,
  distance_km   REAL NOT NULL DEFAULT 0,
  capacity      INTEGER NOT NULL CHECK (capacity >= 0),
  occupancy     INTEGER NOT NULL DEFAULT 0 CHECK (occupancy >= 0),
  resources     TEXT NOT NULL DEFAULT '[]',
  contact_phone TEXT NOT NULL DEFAULT '',
  lat           REAL NOT NULL DEFAULT 0,
  lng           REAL NOT NULL DEFAULT 0,
  last_audit_at TEXT,
  last_audit_by TEXT
);

CREATE TABLE IF NOT EXISTS shelter_reservations (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  shelter_id TEXT NOT NULL REFERENCES shelters(id) ON DELETE CASCADE,
  user_id    INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  people     INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS announcements (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  type       TEXT NOT NULL CHECK (type IN ('emergency','warning','info')),
  zone       TEXT,
  issued_by  TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_announcements_created ON announcements(created_at);

CREATE TABLE IF NOT EXISTS inventory (
  id                TEXT PRIMARY KEY,
  organization      TEXT NOT NULL,
  name              TEXT NOT NULL,
  category          TEXT NOT NULL CHECK (category IN ('Food','Water','Medical','Shelter','Sanitation')),
  quantity          INTEGER NOT NULL CHECK (quantity >= 0),
  unit              TEXT NOT NULL,
  min_threshold     INTEGER NOT NULL DEFAULT 0,
  camp_location     TEXT NOT NULL,
  last_restocked_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_inventory_org ON inventory(organization);

CREATE TABLE IF NOT EXISTS dispatch_log (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  organization TEXT NOT NULL,
  supply_id    TEXT,
  category     TEXT NOT NULL,
  kind         TEXT NOT NULL CHECK (kind IN ('DISPATCH','RESTOCK')),
  amount       INTEGER NOT NULL,
  request_id   TEXT,
  actor_id     INTEGER,
  note         TEXT,
  created_at   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_dispatch_org ON dispatch_log(organization);
CREATE INDEX IF NOT EXISTS idx_dispatch_request ON dispatch_log(request_id);

CREATE TABLE IF NOT EXISTS ngo_volunteers (
  id            TEXT PRIMARY KEY,
  organization  TEXT NOT NULL,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL,
  assigned_camp TEXT NOT NULL,
  current_task  TEXT NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('On Field','At Hub','Resting')),
  phone         TEXT NOT NULL,
  skills        TEXT NOT NULL DEFAULT '[]',
  hours_active  REAL NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ngo_camps (
  id                      TEXT PRIMARY KEY,
  ngo_name                TEXT NOT NULL,
  camp_name               TEXT NOT NULL,
  location                TEXT NOT NULL,
  food_packs_available    INTEGER NOT NULL DEFAULT 0,
  water_bottles_available INTEGER NOT NULL DEFAULT 0,
  medical_kits_available  INTEGER NOT NULL DEFAULT 0,
  volunteers_on_site      INTEGER NOT NULL DEFAULT 0,
  status                  TEXT NOT NULL CHECK (status IN ('Active','Restocking'))
);

CREATE TABLE IF NOT EXISTS volunteer_tasks (
  id                 TEXT PRIMARY KEY,
  title              TEXT NOT NULL,
  category           TEXT NOT NULL,
  urgency            TEXT NOT NULL CHECK (urgency IN ('Critical','High','Medium')),
  location           TEXT NOT NULL,
  assigned_volunteer TEXT,
  volunteer_id       INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status             TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open','Claimed','Completed')),
  distance_km        REAL NOT NULL DEFAULT 1,
  reported_at        TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS disaster_zones (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  disaster_type       TEXT NOT NULL,
  severity            TEXT NOT NULL,
  affected_areas      TEXT NOT NULL DEFAULT '[]',
  affected_population INTEGER NOT NULL DEFAULT 0,
  evacuated_count     INTEGER NOT NULL DEFAULT 0,
  active_teams        TEXT NOT NULL DEFAULT '',
  status              TEXT NOT NULL CHECK (status IN ('Active Crisis','Containment in Progress','Standby / Under Watch')),
  updated_at          TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS gov_agencies (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  type             TEXT NOT NULL,
  command_lead     TEXT NOT NULL,
  active_personnel INTEGER NOT NULL DEFAULT 0,
  assigned_sector  TEXT NOT NULL,
  status           TEXT NOT NULL CHECK (status IN ('Deployed','Standby','Enroute'))
);

CREATE TABLE IF NOT EXISTS sos_alerts (
  id             TEXT PRIMARY KEY,
  user_id        INTEGER REFERENCES users(id) ON DELETE SET NULL,
  user_name      TEXT NOT NULL,
  location       TEXT NOT NULL,
  emergency_type TEXT NOT NULL,
  latitude       REAL,
  longitude      REAL,
  request_id     TEXT REFERENCES requests(id) ON DELETE SET NULL,
  created_at     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_id    INTEGER,
  actor_name  TEXT,
  actor_role  TEXT,
  action      TEXT NOT NULL,
  entity_type TEXT,
  entity_id   TEXT,
  details     TEXT,
  created_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);

CREATE TABLE IF NOT EXISTS counters (
  name  TEXT PRIMARY KEY,
  value INTEGER NOT NULL
);
`;

function open(file: string): DB {
  if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
  const conn = wrap(new DatabaseSync(file));
  conn.pragma('journal_mode = WAL');
  conn.pragma('foreign_keys = ON');
  conn.pragma('busy_timeout = 5000');
  conn.exec(SCHEMA);
  return conn;
}

export const db: DB = open(config.dbPath);

/** Atomic, gap-free sequence per prefix. First call for a prefix returns `start`. */
const seqStmt = db.prepare(
  `INSERT INTO counters(name, value) VALUES (@name, @start)
   ON CONFLICT(name) DO UPDATE SET value = value + 1
   RETURNING value`
);

export function nextSeq(name: string, start: number): number {
  const row = seqStmt.get({ name, start }) as { value: number };
  return row.value;
}

export const ID_START = { REQ: 1001, SOS: 2001, SUP: 101, ANN: 4 } as const;
export const nextId = (prefix: keyof typeof ID_START) => `${prefix}-${nextSeq(prefix, ID_START[prefix])}`;

export function resetDatabase(): void {
  const tables = db
    .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`)
    .all() as { name: string }[];
  db.pragma('foreign_keys = OFF');
  db.transaction(() => {
    for (const t of tables) db.exec(`DELETE FROM "${t.name}"`);
    db.exec(`DELETE FROM sqlite_sequence`);
  })();
  db.pragma('foreign_keys = ON');
}
