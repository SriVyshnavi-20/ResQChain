import type {
  Announcement,
  AssistanceRequest,
  DisasterZone,
  GovernmentAgency,
  InventorySupply,
  NgoCamp,
  NgoVolunteer,
  Shelter,
  User,
  UserPreferences,
  VolunteerAssignment,
  VolunteerTask
} from '../../src/types';
import { db } from '../db';
import { ago, clock } from './time';
import { parseTimeline, renderTimeline } from './timeline';
import type { AssignmentRow, InventoryRow, RequestRow, Role, ShelterRow, UserRow } from './rows';

const json = <T>(value: string | null | undefined, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

/* ------------------------------ preferences ------------------------------ */

export const PREFERENCE_KEYS: Record<Role, (keyof UserPreferences)[]> = {
  Victim: ['criticalAlerts', 'darkMode', 'dailySummaryEmail'],
  Volunteer: ['criticalAlerts', 'assignmentNotifications', 'darkMode', 'dailySummary'],
  NGO: ['criticalAlerts', 'supplyDepletionAlerts', 'dispatchConfirmations', 'darkMode', 'dailySummary'],
  'Government Official': ['criticalAlerts', 'disasterEscalationAlerts', 'interAgencyBroadcasts', 'darkMode', 'dailySummary']
};

export function defaultPreferences(role: Role): UserPreferences {
  switch (role) {
    case 'Victim':
      return { criticalAlerts: true, darkMode: false, dailySummaryEmail: false };
    case 'Volunteer':
      return { criticalAlerts: true, assignmentNotifications: true, darkMode: false, dailySummary: true };
    case 'NGO':
      return { criticalAlerts: true, supplyDepletionAlerts: true, dispatchConfirmations: true, darkMode: false, dailySummary: true };
    default:
      return { criticalAlerts: true, disasterEscalationAlerts: true, interAgencyBroadcasts: true, darkMode: false, dailySummary: true };
  }
}

/* --------------------------------- shelter -------------------------------- */

export function shelterStatus(capacity: number, occupancy: number): Shelter['status'] {
  const available = capacity - occupancy;
  if (available <= 0) return 'Full';
  if (capacity > 0 && occupancy / capacity >= 0.85) return 'Near Full';
  return 'Available';
}

export function shelterDto(s: ShelterRow): Shelter {
  return {
    id: s.id,
    name: s.name,
    address: s.address,
    zone: s.zone,
    distanceKm: s.distance_km,
    capacity: s.capacity,
    occupancy: s.occupancy,
    availableSpaces: Math.max(0, s.capacity - s.occupancy),
    status: shelterStatus(s.capacity, s.occupancy),
    resources: json(s.resources, [] as Shelter['resources']),
    contactPhone: s.contact_phone,
    coordinates: { lat: s.lat, lng: s.lng }
  };
}

export function listShelters(): Shelter[] {
  const rows = db.prepare(`SELECT * FROM shelters ORDER BY rowid`).all() as ShelterRow[];
  return rows.map(shelterDto);
}

/* ---------------------------------- user ---------------------------------- */

const count = (sql: string, ...params: unknown[]) => (db.prepare(sql).get(...params) as { n: number }).n;

export function suppliesDispatched(organization: string | null): number {
  if (!organization) return 0;
  return count(`SELECT COALESCE(SUM(amount),0) n FROM dispatch_log WHERE organization = ? AND kind = 'DISPATCH'`, organization);
}

function nearestShelter(): { name: string; distance: string } | null {
  const row = db
    .prepare(
      `SELECT name, distance_km FROM shelters WHERE capacity > occupancy
       ORDER BY distance_km ASC, (capacity - occupancy) DESC LIMIT 1`
    )
    .get() as { name: string; distance_km: number } | undefined;
  return row ? { name: row.name, distance: `${row.distance_km} km` } : null;
}

export function userDto(u: UserRow): User {
  const prefs = { ...defaultPreferences(u.role), ...json<Partial<UserPreferences>>(u.preferences, {}) };
  const out: User = {
    name: u.name,
    role: u.role,
    location: u.location,
    email: u.email,
    preferences: prefs
  };
  if (u.phone) out.phone = u.phone;
  if (u.avatar_url) out.avatarUrl = u.avatar_url;

  switch (u.role) {
    case 'Victim': {
      out.familySize = u.family_size ?? '1 member';
      out.needType = u.need_type ?? '';
      out.isSafe = !!u.is_safe;
      const near = nearestShelter();
      if (near) {
        out.nearestShelter = near.name;
        out.nearestShelterDistance = near.distance;
      }
      break;
    }
    case 'Volunteer': {
      out.zone = u.zone ?? '';
      out.shift = u.shift ?? '';
      out.skills = json<string[]>(u.skills, []);
      out.availability = u.availability;
      out.tasksCompleted = u.tasks_completed;
      out.peopleAssisted = u.people_assisted;
      out.activeTasks = count(
        `SELECT COUNT(*) n FROM assignments WHERE volunteer_id = ? AND status IN ('Accepted','Enroute')`,
        u.id
      );
      out.availableTasks = count(
        `SELECT COUNT(*) n FROM assignments a WHERE a.status = 'Pending'
         AND NOT EXISTS (SELECT 1 FROM assignment_declines d WHERE d.assignment_id = a.id AND d.volunteer_id = ?)`,
        u.id
      );
      if (u.rating != null) out.rating = u.rating;
      if (u.organization) out.organization = u.organization;
      if (u.badge_number) out.badgeNumber = u.badge_number;
      break;
    }
    case 'NGO': {
      out.organization = u.organization ?? '';
      if (u.registration_number) out.registrationNumber = u.registration_number;
      out.coverageZones = json<string[]>(u.coverage_zones, []);
      out.activeCampsCount = u.organization ? count(`SELECT COUNT(*) n FROM ngo_camps WHERE ngo_name = ?`, u.organization) : 0;
      out.suppliesDispatchedCount = suppliesDispatched(u.organization);
      break;
    }
    case 'Government Official': {
      if (u.designation) out.designation = u.designation;
      if (u.department) out.department = u.department;
      if (u.official_id) out.officialId = u.official_id;
      if (u.jurisdiction) out.jurisdiction = u.jurisdiction;
      if (u.organization) out.organization = u.organization;
      out.activeCrisesCount = count(`SELECT COUNT(*) n FROM disaster_zones WHERE status != 'Standby / Under Watch'`);
      break;
    }
  }
  return out;
}

/* -------------------------------- requests -------------------------------- */

export function requestDto(r: RequestRow): AssistanceRequest {
  return {
    id: r.id,
    requestTitle: r.request_title,
    category: r.category,
    disasterType: r.disaster_type as AssistanceRequest['disasterType'],
    urgency: r.urgency,
    status: r.status,
    victimName: r.victim_name,
    location: r.location,
    phone: r.phone ?? '',
    details: r.details,
    timestamp: clock(r.created_at),
    ...(r.assigned_to ? { assignedTo: r.assigned_to } : {}),
    ...(r.assigned_responder_phone ? { assignedResponderPhone: r.assigned_responder_phone } : {}),
    peopleCount: r.people_count,
    timeline: renderTimeline(parseTimeline(r.timeline), r.status)
  };
}

export function assignmentDto(a: AssignmentRow): VolunteerAssignment {
  return {
    id: a.id,
    emergencyType: a.emergency_type,
    location: a.location,
    distanceKm: a.distance_km,
    severity: a.severity,
    status: a.status,
    time: ago(a.created_at),
    requester: a.requester,
    notes: a.notes
  };
}

/* ------------------------------ misc entities ------------------------------ */

export function announcementDto(a: {
  id: string;
  title: string;
  message: string;
  type: Announcement['type'];
  zone: string | null;
  issued_by: string | null;
  created_at: string;
}): Announcement {
  return {
    id: a.id,
    title: a.title,
    message: a.message,
    type: a.type,
    timestamp: ago(a.created_at),
    ...(a.zone ? { zone: a.zone } : {}),
    ...(a.issued_by ? { issuedBy: a.issued_by } : {})
  };
}

export function inventoryStatus(quantity: number, minThreshold: number): InventorySupply['status'] {
  if (quantity <= minThreshold * 0.5) return 'Critical';
  if (quantity <= minThreshold) return 'Low Stock';
  return 'Adequate';
}

export function inventoryDto(i: InventoryRow): InventorySupply {
  return {
    id: i.id,
    name: i.name,
    category: i.category,
    quantity: i.quantity,
    unit: i.unit,
    minThreshold: i.min_threshold,
    status: inventoryStatus(i.quantity, i.min_threshold),
    campLocation: i.camp_location,
    lastRestocked: ago(i.last_restocked_at)
  };
}

export function ngoVolunteerDto(v: {
  id: string;
  name: string;
  role: string;
  assigned_camp: string;
  current_task: string;
  status: NgoVolunteer['status'];
  phone: string;
  skills: string;
  hours_active: number;
}): NgoVolunteer {
  return {
    id: v.id,
    name: v.name,
    role: v.role,
    assignedCamp: v.assigned_camp,
    currentTask: v.current_task,
    status: v.status,
    phone: v.phone,
    skills: json<string[]>(v.skills, []),
    hoursActive: v.hours_active
  };
}

export function ngoCampDto(c: {
  id: string;
  ngo_name: string;
  camp_name: string;
  location: string;
  food_packs_available: number;
  water_bottles_available: number;
  medical_kits_available: number;
  volunteers_on_site: number;
  status: NgoCamp['status'];
}): NgoCamp {
  return {
    id: c.id,
    ngoName: c.ngo_name,
    campName: c.camp_name,
    location: c.location,
    foodPacksAvailable: c.food_packs_available,
    waterBottlesAvailable: c.water_bottles_available,
    medicalKitsAvailable: c.medical_kits_available,
    volunteersOnSite: c.volunteers_on_site,
    status: c.status
  };
}

export function volunteerTaskDto(t: {
  id: string;
  title: string;
  category: string;
  urgency: VolunteerTask['urgency'];
  location: string;
  assigned_volunteer: string | null;
  status: VolunteerTask['status'];
  distance_km: number;
  reported_at: string;
}): VolunteerTask {
  return {
    id: t.id,
    title: t.title,
    category: t.category,
    urgency: t.urgency,
    location: t.location,
    ...(t.assigned_volunteer ? { assignedVolunteer: t.assigned_volunteer } : {}),
    status: t.status,
    distanceKm: t.distance_km,
    reportedAt: ago(t.reported_at)
  };
}

export function zoneDto(z: {
  id: string;
  name: string;
  disaster_type: DisasterZone['disasterType'];
  severity: DisasterZone['severity'];
  affected_areas: string;
  affected_population: number;
  evacuated_count: number;
  active_teams: string;
  status: DisasterZone['status'];
  updated_at: string;
}): DisasterZone {
  return {
    id: z.id,
    name: z.name,
    disasterType: z.disaster_type,
    severity: z.severity,
    affectedAreas: json<string[]>(z.affected_areas, []),
    affectedPopulation: z.affected_population,
    evacuatedCount: z.evacuated_count,
    activeTeams: z.active_teams,
    status: z.status,
    lastUpdated: ago(z.updated_at)
  };
}

export function agencyDto(a: {
  id: string;
  name: string;
  type: GovernmentAgency['type'];
  command_lead: string;
  active_personnel: number;
  assigned_sector: string;
  status: GovernmentAgency['status'];
}): GovernmentAgency {
  return {
    id: a.id,
    name: a.name,
    type: a.type,
    commandLead: a.command_lead,
    activePersonnel: a.active_personnel,
    assignedSector: a.assigned_sector,
    status: a.status
  };
}
