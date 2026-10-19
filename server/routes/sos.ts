import { Router } from 'express';
import { z } from 'zod';
import type { SosAlertResponse } from '../../src/types';
import { db, nextId } from '../db';
import { audit } from '../lib/audit';
import { optionalAuth } from '../lib/auth';
import { nowIso, timeOfDay } from '../lib/time';
import { optStr, parse } from '../lib/validate';
import { createRequest } from '../services/requests';

export const sosRouter = Router();

// SOS must work without an account: anyone in distress can raise one from the public landing page.
sosRouter.use(optionalAuth);

const TYPES: Record<string, { category: 'Medical' | 'Rescue' | 'Food & Water'; disaster: string }> = {
  'Flood / Waterlogging': { category: 'Rescue', disaster: 'Flood' },
  'Medical Emergency': { category: 'Medical', disaster: 'Other' },
  'Trapped / Rescue Needed': { category: 'Rescue', disaster: 'Other' },
  'Food & Drinking Water Shortage': { category: 'Food & Water', disaster: 'Flood' }
};

const schema = z.object({
  emergencyType: optStr(100),
  location: optStr(300),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  name: optStr(100),
  phone: optStr(30)
});

sosRouter.post('/', (req, res) => {
  const user = req.user;
  const b = parse(schema, req.body ?? {});
  const type = (b.emergencyType && TYPES[b.emergencyType]) || TYPES['Flood / Waterlogging'];
  const emergencyLabel = b.emergencyType && TYPES[b.emergencyType] ? b.emergencyType : 'Flood / Waterlogging';
  const name = user?.name ?? (b.name || 'Emergency User');
  const location = b.location || user?.location || 'Location not shared';

  const result = db.transaction(() => {
    const sosId = nextId('SOS');
    const request = createRequest({
      victimId: user?.id ?? null,
      victimName: name,
      phone: user?.phone ?? (b.phone || null),
      location,
      category: type.category,
      disasterType: type.disaster,
      urgency: 'Critical',
      details: `SOS beacon raised: ${emergencyLabel}. Immediate response requested.`,
      peopleCount: Math.max(1, parseInt(user?.family_size ?? '', 10) || 1),
      latitude: b.latitude,
      longitude: b.longitude,
      source: 'sos',
      sosId,
      title: `SOS - ${emergencyLabel}`
    });
    db.prepare(
      `INSERT INTO sos_alerts (id, user_id, user_name, location, emergency_type, latitude, longitude, request_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(sosId, user?.id ?? null, name, location, emergencyLabel, b.latitude ?? null, b.longitude ?? null, request.id, nowIso());
    return { sosId, request };
  })();

  audit(user ?? null, 'SOS_TRIGGERED', 'sos', result.sosId, { requestId: result.request.id });
  const alert: SosAlertResponse & { linkedRequestId: string } = {
    requestId: result.sosId,
    status: 'Emergency Alert Sent',
    timestamp: timeOfDay(nowIso()),
    location,
    userName: name,
    linkedRequestId: result.request.id
  };
  res.status(201).json({ alert, message: 'SOS alert sent. Responders have been notified.' });
});
