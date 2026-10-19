import { Router } from 'express';
import type { EmergencyService, HelplineInfo, LandingData } from '../../src/types';
import { landingStats } from '../services/stats';

export const publicRouter = Router();

const services: EmergencyService[] = [
  { id: 'service-sos', title: 'SOS Emergency', description: 'Instant distress beacon notifying nearby emergency dispatchers and rescue teams.', iconName: 'AlertTriangle', badge: 'Critical', actionText: 'Trigger SOS' },
  { id: 'service-shelter', title: 'Find Shelter', description: 'Locate designated government and community relief shelters with live capacity status.', iconName: 'Home', actionText: 'View Shelters' },
  { id: 'service-medical', title: 'Medical Help', description: 'Connect with mobile medical units, first-aid responders, and ambulance services.', iconName: 'HeartPulse', actionText: 'Request Medical' },
  { id: 'service-supplies', title: 'Food & Water', description: 'Request emergency rations, clean drinking water packs, and baby supplies.', iconName: 'Droplets', actionText: 'Request Supplies' },
  { id: 'service-volunteer', title: 'Volunteer Support', description: 'Get on-ground rescue assistance, elder evacuation, and debris clearance support.', iconName: 'Users', actionText: 'Request Volunteer' }
];

const helplines: HelplineInfo[] = [
  { name: 'National Disaster Helpline', number: '1078', description: 'NDRF 24x7 Toll Free Control Room', type: 'disaster' },
  { name: 'Unified Emergency Services', number: '112', description: 'Police, Fire, and Emergency response', type: 'national' },
  { name: 'Medical Emergency Services', number: '108', description: 'Ambulance and first-aid dispatch', type: 'medical' },
  { name: 'State Disaster Management', number: '1070', description: 'Tamil Nadu State Emergency Control Room', type: 'disaster' }
];

publicRouter.get('/landing', (_req, res) => {
  const data: LandingData = { services, helplines, stats: landingStats() };
  res.json(data);
});
