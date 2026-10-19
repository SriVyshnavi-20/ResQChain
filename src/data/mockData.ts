import { EmergencyService, HelplineInfo } from '../types';

// All application data (users, requests, shelters, inventory, ...) now lives in the backend database
// (see server/seed.ts). These are only the static fallbacks the public landing page shows for the
// instant before /api/public/landing responds (or if the API is unreachable).

export const DEFAULT_SERVICES: EmergencyService[] = [
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

export const DEFAULT_HELPLINES: HelplineInfo[] = [
  { name: 'National Disaster Helpline', number: '1078', description: 'NDRF 24x7 Toll Free Control Room', type: 'disaster' },
  { name: 'Unified Emergency Services', number: '112', description: 'Police, Fire, and Emergency response', type: 'national' },
  { name: 'Medical Emergency Services', number: '108', description: 'Ambulance and first-aid dispatch', type: 'medical' },
  { name: 'State Disaster Management', number: '1070', description: 'Tamil Nadu State Emergency Control Room', type: 'disaster' }
];

export const DEFAULT_PLATFORM_STATS = {
  peopleHelped: '--',
  requestsResolved: '--',
  activeVolunteers: '--'
};
