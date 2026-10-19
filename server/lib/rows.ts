// Raw SQLite row shapes (snake_case) used across routes/services.
export type Role = 'Victim' | 'Volunteer' | 'NGO' | 'Government Official';

export interface UserRow {
  id: number;
  role: Role;
  name: string;
  email: string;
  password_hash: string;
  token_version: number;
  phone: string | null;
  location: string;
  family_size: string | null;
  need_type: string | null;
  is_safe: number;
  preferences: string;
  zone: string | null;
  shift: string | null;
  skills: string | null;
  availability: 'ACTIVE' | 'STANDBY' | 'OFFLINE';
  tasks_completed: number;
  people_assisted: number;
  rating: number | null;
  organization: string | null;
  badge_number: string | null;
  registration_number: string | null;
  coverage_zones: string | null;
  designation: string | null;
  department: string | null;
  official_id: string | null;
  jurisdiction: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface RequestRow {
  id: string;
  victim_id: number | null;
  request_title: string;
  category: 'Medical' | 'Rescue' | 'Food & Water' | 'Shelter' | 'Supplies';
  disaster_type: string;
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Matched' | 'Enroute' | 'Resolved' | 'Cancelled';
  victim_name: string;
  location: string;
  phone: string | null;
  details: string;
  assigned_to: string | null;
  assigned_responder_phone: string | null;
  people_count: number;
  latitude: number | null;
  longitude: number | null;
  source: string;
  sos_id: string | null;
  timeline: string;
  created_at: string;
  updated_at: string;
  matched_at: string | null;
  resolved_at: string | null;
}

export interface AssignmentRow {
  id: string;
  request_id: string | null;
  emergency_type: string;
  location: string;
  distance_km: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Accepted' | 'Enroute' | 'Completed';
  requester: string;
  notes: string;
  people_count: number;
  volunteer_id: number | null;
  created_at: string;
  accepted_at: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export interface ShelterRow {
  id: string;
  name: string;
  address: string;
  zone: string;
  distance_km: number;
  capacity: number;
  occupancy: number;
  resources: string;
  contact_phone: string;
  lat: number;
  lng: number;
  last_audit_at: string | null;
  last_audit_by: string | null;
}

export interface InventoryRow {
  id: string;
  organization: string;
  name: string;
  category: 'Food' | 'Water' | 'Medical' | 'Shelter' | 'Sanitation';
  quantity: number;
  unit: string;
  min_threshold: number;
  camp_location: string;
  last_restocked_at: string;
}
