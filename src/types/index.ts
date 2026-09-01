export type UserRole = 'Victim' | 'Volunteer' | 'NGO' | 'Government Official';

export type AvailabilityStatus = 'ACTIVE' | 'STANDBY' | 'OFFLINE';

export interface UserPreferences {
  criticalAlerts: boolean;
  assignmentNotifications?: boolean;
  supplyDepletionAlerts?: boolean;
  dispatchConfirmations?: boolean;
  disasterEscalationAlerts?: boolean;
  interAgencyBroadcasts?: boolean;
  darkMode: boolean;
  dailySummary?: boolean;
  dailySummaryEmail?: boolean;
}

export interface User {
  name: string;
  role: UserRole;
  location: string;
  email: string;
  phone?: string;
  familySize?: string;
  needType?: string;
  isSafe?: boolean;
  nearestShelter?: string;
  nearestShelterDistance?: string;
  preferences?: UserPreferences;
  // Volunteer specific fields
  zone?: string;
  shift?: string;
  skills?: string[];
  availability?: AvailabilityStatus;
  tasksCompleted?: number;
  activeTasks?: number;
  availableTasks?: number;
  peopleAssisted?: number;
  rating?: number;
  // NGO specific fields
  organization?: string;
  badgeNumber?: string;
  registrationNumber?: string;
  activeCampsCount?: number;
  coverageZones?: string[];
  suppliesDispatchedCount?: number;
  // Government specific fields
  designation?: string;
  department?: string;
  officialId?: string;
  jurisdiction?: string;
  activeCrisesCount?: number;
  avatarUrl?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'warning' | 'info';
  timestamp: string;
  zone?: string;
  issuedBy?: string;
}

export interface EmergencyService {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  actionText: string;
}

export interface HelplineInfo {
  name: string;
  number: string;
  description: string;
  type: 'national' | 'police' | 'medical' | 'disaster';
}

export interface SosAlertResponse {
  requestId: string;
  status: string;
  timestamp: string;
  location: string;
  userName: string;
  assignedUnit?: string;
}

export interface Shelter {
  id: string;
  name: string;
  address: string;
  zone: string;
  distanceKm: number;
  capacity: number;
  occupancy: number;
  availableSpaces: number;
  status: 'Available' | 'Near Full' | 'Full';
  resources: ('Food' | 'Water' | 'Medical' | 'Clothing' | 'Generator')[];
  contactPhone: string;
  coordinates: { lat: number; lng: number };
}

export interface TimelineEvent {
  title: string;
  subtitle: string;
  time?: string;
  completed: boolean;
  current: boolean;
}

export interface AssistanceRequest {
  id: string;
  requestTitle: string;
  category: 'Medical' | 'Rescue' | 'Food & Water' | 'Shelter' | 'Supplies';
  disasterType?: 'Flood' | 'Fire' | 'Earthquake' | 'Cyclone' | 'Landslide' | 'Other';
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Matched' | 'Enroute' | 'Resolved' | 'Cancelled';
  victimName: string;
  location: string;
  phone: string;
  details: string;
  timestamp: string;
  assignedTo?: string;
  assignedResponderPhone?: string;
  peopleCount: number;
  timeline: TimelineEvent[];
}

export interface VolunteerAssignment {
  id: string;
  emergencyType: string;
  location: string;
  distanceKm: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Accepted' | 'Enroute' | 'Completed';
  time: string;
  requester: string;
  notes: string;
}

// Stage 4 NGO Models
export interface InventorySupply {
  id: string;
  name: string;
  category: 'Food' | 'Water' | 'Medical' | 'Shelter' | 'Sanitation';
  quantity: number;
  unit: string;
  minThreshold: number;
  status: 'Adequate' | 'Low Stock' | 'Critical';
  campLocation: string;
  lastRestocked: string;
}

export interface NgoVolunteer {
  id: string;
  name: string;
  role: string;
  assignedCamp: string;
  currentTask: string;
  status: 'On Field' | 'At Hub' | 'Resting';
  phone: string;
  skills: string[];
  hoursActive: number;
}

export interface NgoCamp {
  id: string;
  ngoName: string;
  campName: string;
  location: string;
  foodPacksAvailable: number;
  waterBottlesAvailable: number;
  medicalKitsAvailable: number;
  volunteersOnSite: number;
  status: 'Active' | 'Restocking';
}

export interface VolunteerTask {
  id: string;
  title: string;
  category: string;
  urgency: 'Critical' | 'High' | 'Medium';
  location: string;
  assignedVolunteer?: string;
  status: 'Open' | 'Claimed' | 'Completed';
  distanceKm: number;
  reportedAt: string;
}

// Stage 5 Government Models
export interface DisasterZone {
  id: string;
  name: string;
  disasterType: 'Flood' | 'Cyclone' | 'Fire' | 'Landslide' | 'Earthquake';
  severity: 'Critical (Red Alert)' | 'High (Orange Alert)' | 'Medium (Yellow Alert)';
  affectedAreas: string[];
  affectedPopulation: number;
  evacuatedCount: number;
  activeTeams: string;
  status: 'Active Crisis' | 'Containment in Progress' | 'Standby / Under Watch';
  lastUpdated: string;
}

export interface GovernmentAgency {
  id: string;
  name: string;
  type: 'Armed Forces / NDRF' | 'State Police' | 'Medical Corps' | 'NGO Partner';
  commandLead: string;
  activePersonnel: number;
  assignedSector: string;
  status: 'Deployed' | 'Standby' | 'Enroute';
}
