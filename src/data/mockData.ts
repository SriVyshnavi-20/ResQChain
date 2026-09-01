import {
  User,
  Announcement,
  HelplineInfo,
  EmergencyService,
  Shelter,
  AssistanceRequest,
  VolunteerAssignment,
  InventorySupply,
  NgoVolunteer,
  NgoCamp,
  VolunteerTask,
  DisasterZone,
  GovernmentAgency
} from '../types';

export const MOCK_USERS: Record<string, User> = {
  Victim: {
    name: 'Anvitha Shetty',
    role: 'Victim',
    location: 'Chennai, Tamil Nadu',
    email: 'anvi123@org',
    phone: '+91 98401 23456',
    familySize: '4 members',
    needType: 'Shelter, Food',
    isSafe: false,
    nearestShelter: 'Anna Nagar Shelter',
    nearestShelterDistance: '1.2 km',
    preferences: {
      criticalAlerts: true,
      darkMode: false,
      dailySummaryEmail: false
    }
  },
  Volunteer: {
    name: 'Priya Nair',
    role: 'Volunteer',
    location: 'Lakeview Zone, Chennai',
    email: 'priya.nair@resqchain.org',
    phone: '+91 97890 55432',
    zone: 'Lakeview Zone',
    shift: '9:00 AM - 5:00 PM',
    skills: ['Rescue', 'First Aid', 'Shelter Support'],
    availability: 'ACTIVE',
    tasksCompleted: 18,
    activeTasks: 2,
    availableTasks: 5,
    peopleAssisted: 42,
    rating: 4.8,
    organization: 'Youth Rescue Brigade',
    badgeNumber: 'VOL-7719',
    preferences: {
      criticalAlerts: true,
      assignmentNotifications: true,
      darkMode: false,
      dailySummary: true
    }
  },
  NGO: {
    name: 'Dr. Priya Sundaram',
    role: 'NGO',
    location: 'T. Nagar Disaster Hub, Chennai',
    email: 'priya@redcrossrelief.org',
    phone: '+91 94440 67890',
    organization: 'Red Cross Disaster Relief Foundation',
    registrationNumber: 'NGO-IND-TN-4092',
    activeCampsCount: 3,
    coverageZones: ['Central District', 'South Sector', 'Riverside Lowland'],
    suppliesDispatchedCount: 14250,
    preferences: {
      criticalAlerts: true,
      supplyDepletionAlerts: true,
      dispatchConfirmations: true,
      darkMode: false,
      dailySummary: true
    }
  },
  'Government Official': {
    name: 'R. Rajesh IAS',
    role: 'Government Official',
    designation: 'Principal Secretary & State Relief Commissioner',
    department: 'Tamil Nadu State Disaster Management Authority (TNSDMA)',
    location: 'Ezhilagam, Chepauk, Chennai',
    email: 'rajesh.sdma@gov.in',
    phone: '+91 44 2859 3990',
    officialId: 'GOV-TN-IAS-109',
    jurisdiction: 'Statewide / Chennai Metropolitan Region',
    activeCrisesCount: 3,
    organization: 'Tamil Nadu State Disaster Management Authority (TNSDMA)',
    preferences: {
      criticalAlerts: true,
      disasterEscalationAlerts: true,
      interAgencyBroadcasts: true,
      darkMode: false,
      dailySummary: true
    }
  }
};

export const MOCK_CURRENT_USER = MOCK_USERS.Victim;

export const MOCK_DISASTER_ZONES: DisasterZone[] = [
  {
    id: 'DIS-01',
    name: 'Adyar River Basin Flood Inundation',
    disasterType: 'Flood',
    severity: 'Critical (Red Alert)',
    affectedAreas: ['Riverside Road', 'Saidapet Lowland', 'Kotturpuram Causeway'],
    affectedPopulation: 18400,
    evacuatedCount: 14200,
    activeTeams: 'NDRF 04 Battalion & Youth Rescue Brigade',
    status: 'Active Crisis',
    lastUpdated: '10 mins ago'
  },
  {
    id: 'DIS-02',
    name: 'Marina Coastal Cyclone Surge',
    disasterType: 'Cyclone',
    severity: 'High (Orange Alert)',
    affectedAreas: ['Marina Foreshore', 'Pattinapakkam Coastal Belt'],
    affectedPopulation: 9200,
    evacuatedCount: 7800,
    activeTeams: 'State Police Coastal QRT & Coast Guard',
    status: 'Containment in Progress',
    lastUpdated: '25 mins ago'
  },
  {
    id: 'DIS-03',
    name: 'Downtown Substation Fire Hazard',
    disasterType: 'Fire',
    severity: 'Medium (Yellow Alert)',
    affectedAreas: ['Downtown Substation Sector 4'],
    affectedPopulation: 3400,
    evacuatedCount: 3100,
    activeTeams: 'TN Fire & Rescue Services Station 12',
    status: 'Standby / Under Watch',
    lastUpdated: '1 hour ago'
  }
];

export const MOCK_GOV_AGENCIES: GovernmentAgency[] = [
  {
    id: 'AGY-01',
    name: 'NDRF 04 Battalion (Arakkonam Command)',
    type: 'Armed Forces / NDRF',
    commandLead: 'Commandant S. K. Verma',
    activePersonnel: 240,
    assignedSector: 'Adyar River Basin',
    status: 'Deployed'
  },
  {
    id: 'AGY-02',
    name: 'Red Cross Disaster Relief Foundation',
    type: 'NGO Partner',
    commandLead: 'Dr. Priya Sundaram',
    activePersonnel: 120,
    assignedSector: 'Central & South Sector Hubs',
    status: 'Deployed'
  },
  {
    id: 'AGY-03',
    name: 'Youth Rescue Brigade Taskforce',
    type: 'NGO Partner',
    commandLead: 'V. Vasu / Priya Nair',
    activePersonnel: 85,
    assignedSector: 'Riverside Lowland Causeway',
    status: 'Deployed'
  },
  {
    id: 'AGY-04',
    name: 'Chennai City Police Coastal QRT',
    type: 'State Police',
    commandLead: 'DCP R. Natarajan',
    activePersonnel: 180,
    assignedSector: 'Marina Coastal Belt',
    status: 'Deployed'
  },
  {
    id: 'AGY-05',
    name: 'State Medical Emergency Corps',
    type: 'Medical Corps',
    commandLead: 'Dr. K. Swaminathan',
    activePersonnel: 90,
    assignedSector: 'Central District Relief Hub',
    status: 'Standby'
  }
];

export const MOCK_INVENTORY_SUPPLIES: InventorySupply[] = [
  {
    id: 'SUP-101',
    name: 'Emergency Food Ration Packs',
    category: 'Food',
    quantity: 1250,
    unit: 'Packs',
    minThreshold: 500,
    status: 'Adequate',
    campLocation: 'Central District Hub #1',
    lastRestocked: '2 hours ago'
  },
  {
    id: 'SUP-102',
    name: 'Packaged Drinking Water (1L)',
    category: 'Water',
    quantity: 3400,
    unit: 'Bottles',
    minThreshold: 1000,
    status: 'Adequate',
    campLocation: 'Central District Hub #1',
    lastRestocked: '1 hour ago'
  },
  {
    id: 'SUP-103',
    name: 'Trauma & First Aid Medical Kits',
    category: 'Medical',
    quantity: 180,
    unit: 'Kits',
    minThreshold: 150,
    status: 'Adequate',
    campLocation: 'Central District Hub #1',
    lastRestocked: 'Yesterday'
  },
  {
    id: 'SUP-104',
    name: 'Woolen Warm Blankets',
    category: 'Shelter',
    quantity: 320,
    unit: 'Packs',
    minThreshold: 400,
    status: 'Low Stock',
    campLocation: 'South Sector Camp',
    lastRestocked: '3 days ago'
  },
  {
    id: 'SUP-105',
    name: 'Hygiene & Sanitation Kits',
    category: 'Sanitation',
    quantity: 95,
    unit: 'Kits',
    minThreshold: 200,
    status: 'Critical',
    campLocation: 'Riverside Lowland Camp',
    lastRestocked: '4 days ago'
  },
  {
    id: 'SUP-106',
    name: 'Baby Care & Milk Packs',
    category: 'Food',
    quantity: 140,
    unit: 'Packs',
    minThreshold: 150,
    status: 'Low Stock',
    campLocation: 'Central District Hub #1',
    lastRestocked: 'Yesterday'
  }
];

export const MOCK_NGO_VOLUNTEERS: NgoVolunteer[] = [
  {
    id: 'VOL-01',
    name: 'Karthik Raja',
    role: 'Senior Rescue Lead',
    assignedCamp: 'Central District Hub #1',
    currentTask: 'Water distribution in Sector 3',
    status: 'On Field',
    phone: '+91 97890 12345',
    skills: ['Rescue Boat Navigation', 'Elder Evacuation'],
    hoursActive: 6.5
  },
  {
    id: 'VOL-02',
    name: 'Priya Nair',
    role: 'Medical & Aid Coordinator',
    assignedCamp: 'South Sector Camp',
    currentTask: 'First-aid station triage',
    status: 'On Field',
    phone: '+91 97890 55432',
    skills: ['First Aid', 'Shelter Intake'],
    hoursActive: 5.0
  },
  {
    id: 'VOL-03',
    name: 'Arun Kumar',
    role: 'Logistics Specialist',
    assignedCamp: 'Central District Hub #1',
    currentTask: 'Unloading drinking water consignment',
    status: 'At Hub',
    phone: '+91 94451 88201',
    skills: ['Inventory Management', 'Supply Dispatch'],
    hoursActive: 4.0
  },
  {
    id: 'VOL-04',
    name: 'Sneha Raman',
    role: 'Sanitation & Hygiene Worker',
    assignedCamp: 'Riverside Lowland Camp',
    currentTask: 'Hygiene kit distribution',
    status: 'On Field',
    phone: '+91 98402 11984',
    skills: ['Public Health', 'Water Purification'],
    hoursActive: 7.2
  },
  {
    id: 'VOL-05',
    name: 'M. Iyer',
    role: 'Shelter Care Volunteer',
    assignedCamp: 'South Sector Camp',
    currentTask: 'Rest break after night shift',
    status: 'Resting',
    phone: '+91 98402 33119',
    skills: ['Shelter Care', 'Counseling'],
    hoursActive: 8.0
  }
];

export const MOCK_VOLUNTEER_ASSIGNMENTS: VolunteerAssignment[] = [
  {
    id: 'REQ-7041',
    emergencyType: 'Food & Water',
    location: 'Shelter B, Downtown',
    distanceKm: 0.8,
    severity: 'Critical',
    status: 'Pending',
    time: 'Now',
    requester: 'Emergency User (Downtown Sector)',
    notes: 'Immediate clean drinking water packs and meal rations required for 4 individuals stranded on upper floor.'
  },
  {
    id: 'REQ-7042',
    emergencyType: 'Medical Assistance',
    location: 'Riverside Zone',
    distanceKm: 1.4,
    severity: 'High',
    status: 'Accepted',
    time: '15 mins ago',
    requester: 'District Clinic Dispatch',
    notes: 'First-aid bandage dressing and antiseptic medicines delivery for senior citizen with minor flood injury.'
  },
  {
    id: 'REQ-7043',
    emergencyType: 'Shelter Assistance',
    location: 'East Colony',
    distanceKm: 2.1,
    severity: 'Medium',
    status: 'Completed',
    time: '2 hours ago',
    requester: 'Community Lead',
    notes: 'Assisted 6 families with shelter intake registration and dry blanket distribution.'
  },
  {
    id: 'REQ-7044',
    emergencyType: 'Assist Rescue Boat',
    location: 'Riverside Zone',
    distanceKm: 1.2,
    severity: 'Critical',
    status: 'Pending',
    time: 'Now',
    requester: 'Rescue Captain Suresh',
    notes: 'Assist NDRF inflatable rescue boat team with loading life vests and guiding elders.'
  },
  {
    id: 'REQ-7045',
    emergencyType: 'Escort Family to Shelter',
    location: 'Downtown',
    distanceKm: 0.9,
    severity: 'High',
    status: 'Pending',
    time: '7:00 PM',
    requester: 'Ward Officer Deepa',
    notes: 'Escort a family of 4 from water-logged residential street to Anna Nagar Shelter.'
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'RED ALERT',
    message: 'Riverside Zone: Relief NGOs requested to coordinate hot meal distribution and drinking water supply.',
    type: 'emergency',
    timestamp: '10 mins ago',
    zone: 'Riverside Zone',
    issuedBy: 'TNSDMA Emergency Operations Center'
  },
  {
    id: 'ann-2',
    title: 'FLASH FLOOD',
    message: 'Downtown Sector: Low-lying causeways submerged. NGOs requested to station emergency dry blankets.',
    type: 'warning',
    timestamp: '25 mins ago',
    zone: 'Downtown',
    issuedBy: 'Regional Meteorological Centre'
  },
  {
    id: 'ann-3',
    title: 'RELIEF CENTER ACTIVE',
    message: 'Central District Hub #1 operational with food kitchen, doctor triage, and 1,240 bed capacity.',
    type: 'info',
    timestamp: '1 hour ago',
    zone: 'Central District',
    issuedBy: 'Red Cross Relief Unit'
  }
];

export const MOCK_SHELTERS: Shelter[] = [
  {
    id: 'sh-red-cross',
    name: 'Red Cross Shelter Hub #1',
    address: '14 Gandhi Road, Central Sector, Chennai',
    zone: 'Central District',
    distanceKm: 1.2,
    capacity: 100,
    occupancy: 50,
    availableSpaces: 50,
    status: 'Available',
    resources: ['Food', 'Water', 'Medical'],
    contactPhone: '+91 44 2815 1104',
    coordinates: { lat: 13.0827, lng: 80.2707 }
  },
  {
    id: 'sh-community-hall',
    name: 'Community Hall Relief Shelter',
    address: 'Cathedral Road, Teynampet, Chennai',
    zone: 'South Sector',
    distanceKm: 2.4,
    capacity: 80,
    occupancy: 39,
    availableSpaces: 41,
    status: 'Available',
    resources: ['Food', 'Water'],
    contactPhone: '+91 44 2499 8830',
    coordinates: { lat: 13.0450, lng: 80.2500 }
  },
  {
    id: 'sh-govt-school',
    name: 'Govt School Relief Camp',
    address: 'Kutchery Road, Mylapore, Chennai',
    zone: 'South-East Sector',
    distanceKm: 3.1,
    capacity: 120,
    occupancy: 40,
    availableSpaces: 80,
    status: 'Available',
    resources: ['Water', 'Medical'],
    contactPhone: '+91 44 2464 1212',
    coordinates: { lat: 13.0330, lng: 80.2680 }
  },
  {
    id: 'sh-anna-nagar',
    name: 'Anna Nagar Relief Camp',
    address: 'Anna Nagar West, Near Metro Gate 2, Chennai',
    zone: 'Anna Nagar, Chennai',
    distanceKm: 1.2,
    capacity: 200,
    occupancy: 114,
    availableSpaces: 86,
    status: 'Available',
    resources: ['Food', 'Water', 'Medical', 'Clothing'],
    contactPhone: '+91 44 2621 5590',
    coordinates: { lat: 13.0850, lng: 80.2100 }
  }
];

export const MOCK_REQUESTS: AssistanceRequest[] = [
  {
    id: 'REQ-1042',
    requestTitle: 'Medical Supplies & Insulin',
    category: 'Medical',
    disasterType: 'Flood',
    urgency: 'High',
    status: 'Enroute',
    victimName: 'Anvitha Shetty',
    location: 'Gandhi Riverside',
    phone: '+91 98401 23456',
    details: 'Emergency insulin and sterile dressing required urgently for senior citizen.',
    timestamp: '9:42 AM',
    assignedTo: 'A. Sharma (Red Cross Unit)',
    assignedResponderPhone: '+91 98412 88401',
    peopleCount: 1,
    timeline: [
      { title: 'Request Submitted', subtitle: 'Timestamped and broadcasted to relief ledger', time: '9:42 AM', completed: true, current: false },
      { title: 'Matched to Responder', subtitle: 'Relief responder assigned (A. Sharma)', time: '9:50 AM', completed: true, current: false },
      { title: 'Responder Enroute', subtitle: 'Responder is 1.2 km away with emergency supplies', time: '10:05 AM', completed: false, current: true },
      { title: 'Resolved and Closed', subtitle: 'Assistance delivered and signed off', completed: false, current: false }
    ]
  },
  {
    id: 'REQ-1041',
    requestTitle: 'Food & Drinking Water Rations',
    category: 'Food & Water',
    disasterType: 'Flood',
    urgency: 'Critical',
    status: 'Open',
    victimName: 'Anvitha Shetty',
    location: 'Shelter B, Downtown',
    phone: '+91 98401 23456',
    details: '4 individuals stranded without drinking water and rations for 18 hours.',
    timestamp: '8:30 AM',
    assignedTo: 'Pending NGO Dispatch',
    assignedResponderPhone: '+91 98410 44221',
    peopleCount: 4,
    timeline: [
      { title: 'Request Submitted', subtitle: 'Timestamped and broadcasted to relief ledger', time: '8:30 AM', completed: true, current: false },
      { title: 'Matched to Responder', subtitle: 'Pending NGO supply consignment allocation', time: '8:45 AM', completed: false, current: true },
      { title: 'Responder Enroute', subtitle: 'Enroute to downtown sector', completed: false, current: false },
      { title: 'Resolved and Closed', subtitle: 'Awaiting delivery', completed: false, current: false }
    ]
  },
  {
    id: 'REQ-1039',
    requestTitle: 'Emergency Shelter & Bedding',
    category: 'Shelter',
    disasterType: 'Cyclone',
    urgency: 'Medium',
    status: 'Open',
    victimName: 'Anvitha Shetty',
    location: 'East Colony',
    phone: '+91 98401 23456',
    details: 'Roof damage due to cyclone winds. Need temporary shelter accommodation for family of 4.',
    timestamp: '7:15 AM',
    assignedTo: 'Unassigned',
    peopleCount: 4,
    timeline: [
      { title: 'Request Submitted', subtitle: 'Logged in public emergency pool', time: '7:15 AM', completed: true, current: true },
      { title: 'Matched to Responder', subtitle: 'Awaiting responder assignment', completed: false, current: false },
      { title: 'Responder Enroute', subtitle: 'Pending assignment', completed: false, current: false },
      { title: 'Resolved and Closed', subtitle: 'Pending', completed: false, current: false }
    ]
  },
  {
    id: 'REQ-1035',
    requestTitle: 'Rescue Boat Evacuation',
    category: 'Rescue',
    disasterType: 'Flood',
    urgency: 'Critical',
    status: 'Matched',
    victimName: 'Anvitha Shetty',
    location: 'Riverside Road',
    phone: '+91 98401 23456',
    details: 'Water rising above waist height on ground floor. Inflatable rescue boat needed.',
    timestamp: 'Yesterday',
    assignedTo: 'V. Vasu (Youth Rescue Brigade)',
    assignedResponderPhone: '+91 98408 99123',
    peopleCount: 4,
    timeline: [
      { title: 'Request Submitted', subtitle: 'High-priority distress logged', time: 'Yesterday 4:00 PM', completed: true, current: false },
      { title: 'Matched to Responder', subtitle: 'Relief responder assigned (V. Vasu)', time: 'Yesterday 4:15 PM', completed: true, current: true },
      { title: 'Responder Enroute', subtitle: 'Inflatable boat dispatched', completed: false, current: false },
      { title: 'Resolved and Closed', subtitle: 'Evacuation in progress', completed: false, current: false }
    ]
  },
  {
    id: 'REQ-1030',
    requestTitle: 'Warm Blankets & Clothes',
    category: 'Supplies',
    disasterType: 'Flood',
    urgency: 'Low',
    status: 'Resolved',
    victimName: 'Anvitha Shetty',
    location: 'Shelter A, Northside',
    phone: '+91 98401 23456',
    details: '4 warm blankets requested for nighttime shelter warmth.',
    timestamp: '2 days ago',
    assignedTo: 'M. Iyer (Red Cross)',
    assignedResponderPhone: '+91 98402 33119',
    peopleCount: 4,
    timeline: [
      { title: 'Request Submitted', subtitle: 'Request logged', time: '2 days ago', completed: true, current: false },
      { title: 'Matched to Responder', subtitle: 'Matched to M. Iyer', time: '2 days ago', completed: true, current: false },
      { title: 'Responder Enroute', subtitle: 'Delivered to Shelter A', time: '2 days ago', completed: true, current: false },
      { title: 'Resolved and Closed', subtitle: 'Received and verified by Anvitha', time: '2 days ago', completed: true, current: false }
    ]
  }
];

export const MOCK_VOLUNTEER_TASKS: VolunteerTask[] = [
  {
    id: 'TASK-501',
    title: 'Elderly Evacuation Assistance',
    category: 'Rescue',
    urgency: 'Critical',
    location: 'Lake Area, Nungambakkam (1.4 km away)',
    status: 'Open',
    distanceKm: 1.4,
    reportedAt: '12 mins ago'
  },
  {
    id: 'TASK-502',
    title: 'Drinking Water & Rations Distribution',
    category: 'Food & Water',
    urgency: 'High',
    location: 'Shelter #4 Delivery Depot (2.1 km away)',
    status: 'Claimed',
    assignedVolunteer: 'Priya Nair',
    distanceKm: 2.1,
    reportedAt: '30 mins ago'
  }
];

export const MOCK_NGO_CAMPS: NgoCamp[] = [
  {
    id: 'CAMP-01',
    ngoName: 'Red Cross Disaster Relief Foundation',
    campName: 'Central District Supply Hub #1',
    location: '14 Gandhi Road, Chennai',
    foodPacksAvailable: 1250,
    waterBottlesAvailable: 3400,
    medicalKitsAvailable: 180,
    volunteersOnSite: 24,
    status: 'Active'
  },
  {
    id: 'CAMP-02',
    ngoName: 'Red Cross Disaster Relief Foundation',
    campName: 'South Sector Relief Camp',
    location: 'Cathedral Road, Teynampet, Chennai',
    foodPacksAvailable: 800,
    waterBottlesAvailable: 1900,
    medicalKitsAvailable: 95,
    volunteersOnSite: 18,
    status: 'Active'
  },
  {
    id: 'CAMP-03',
    ngoName: 'Red Cross Disaster Relief Foundation',
    campName: 'Riverside Lowland Mobile Camp',
    location: 'Riverside Causeway, Chennai',
    foodPacksAvailable: 150,
    waterBottlesAvailable: 600,
    medicalKitsAvailable: 310,
    volunteersOnSite: 12,
    status: 'Restocking'
  }
];

export const MOCK_POPULAR_SERVICES: EmergencyService[] = [
  {
    id: 'service-sos',
    title: 'SOS Emergency',
    description: 'Instant distress beacon notifying nearby emergency dispatchers and rescue teams.',
    iconName: 'AlertTriangle',
    badge: 'Critical',
    actionText: 'Trigger SOS'
  },
  {
    id: 'service-shelter',
    title: 'Find Shelter',
    description: 'Locate designated government and community relief shelters with live capacity status.',
    iconName: 'Home',
    actionText: 'View Shelters'
  },
  {
    id: 'service-medical',
    title: 'Medical Help',
    description: 'Connect with mobile medical units, first-aid responders, and ambulance services.',
    iconName: 'HeartPulse',
    actionText: 'Request Medical'
  },
  {
    id: 'service-supplies',
    title: 'Food & Water',
    description: 'Request emergency rations, clean drinking water packs, and baby supplies.',
    iconName: 'Droplets',
    actionText: 'Request Supplies'
  },
  {
    id: 'service-volunteer',
    title: 'Volunteer Support',
    description: 'Get on-ground rescue assistance, elder evacuation, and debris clearance support.',
    iconName: 'Users',
    actionText: 'Request Volunteer'
  }
];

export const MOCK_HELPLINES: HelplineInfo[] = [
  {
    name: 'National Disaster Helpline',
    number: '1078',
    description: 'NDRF 24x7 Toll Free Control Room',
    type: 'disaster'
  },
  {
    name: 'Unified Emergency Services',
    number: '112',
    description: 'Police, Fire, and Emergency response',
    type: 'national'
  },
  {
    name: 'Medical Emergency Services',
    number: '108',
    description: 'Ambulance and first-aid dispatch',
    type: 'medical'
  },
  {
    name: 'State Disaster Management',
    number: '1070',
    description: 'Tamil Nadu State Emergency Control Room',
    type: 'disaster'
  }
];

export const MOCK_PLATFORM_STATS = {
  peopleHelped: '1,420+',
  requestsResolved: '980+',
  activeVolunteers: '350+'
};

export const MOCK_VICTIM_STATS = {
  myRequests: 3,
  resolved: 1,
  peopleHelped: 2
};
