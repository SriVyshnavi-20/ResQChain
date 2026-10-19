// End-to-end API test. Registers its own accounts (there are no built-in logins).
// Usage: start the server on an EMPTY database, then: node scripts/api-test.mjs [baseUrl]
const base = process.argv[2] || 'http://localhost:4000/api';
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('  ok  ', m); } else { fail++; console.log('  FAIL', m); } };
async function call(method, path, { token, body, raw } = {}) {
  const r = await fetch(base + path, { method, headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  if (raw) return r;
  const t = await r.text(); let data; try { data = JSON.parse(t); } catch { data = t; }
  return { status: r.status, data };
}
const stamp = Date.now();
const PW = 'S3cretpass!';
async function signUp(role, tag, extra = {}) {
  const email = `${tag}.${stamp}@test.org`;
  const reg = await call('POST', '/auth/register', { body: { role, name: `${tag} user`, email, password: PW, phone: '+91 90000 00000', location: 'Chennai', ...extra } });
  const lg = await call('POST', '/auth/login', { body: { email, password: PW, role } });
  return { email, reg, token: lg.data.token, user: lg.data.user };
}

console.log('NO BUILT-IN ACCOUNTS');
for (const [email, role] of [['anvi123@org', 'Victim'], ['priya.nair@resqchain.org', 'Volunteer'], ['priya@redcrossrelief.org', 'NGO'], ['rajesh.sdma@gov.in', 'Government Official']]) {
  const r = await call('POST', '/auth/login', { body: { email, password: 'password123', role } });
  ok(r.status === 401, `old demo login ${email} no longer works`);
}

console.log('REGISTER FIRST, THEN LOGIN');
let r = await call('POST', '/auth/register', { body: { role: 'Victim', name: 'X', email: 'bad', password: 'longenough1' } });
ok(r.status === 400, 'invalid name/email rejected');
r = await call('POST', '/auth/register', { body: { role: 'Victim', name: 'Weak Pw', email: `w${stamp}@test.org`, password: 'short' } });
ok(r.status === 400, 'password under 8 chars rejected');
const vEmail = `victim.${stamp}@test.org`;
r = await call('POST', '/auth/login', { body: { email: vEmail, password: PW, role: 'Victim' } });
ok(r.status === 401, 'cannot log in before registering');
r = await call('POST', '/auth/register', { body: { role: 'Victim', name: 'Victim User', email: vEmail, password: PW, location: 'Chennai' } });
ok(r.status === 201 && !r.data.token && r.data.user.role === 'Victim', 'register creates the account and does NOT sign in (no token)');
r = await call('POST', '/auth/register', { body: { role: 'Victim', name: 'Dup', email: vEmail.toUpperCase(), password: PW } });
ok(r.status === 409, 'duplicate email (any case) -> 409');
r = await call('POST', '/auth/login', { body: { email: vEmail, password: 'wrongpass1', role: 'Victim' } });
ok(r.status === 401, 'wrong password -> 401');
r = await call('POST', '/auth/login', { body: { email: vEmail, password: PW, role: 'NGO' } });
ok(r.status === 403, 'right password, wrong role -> 403');
r = await call('POST', '/auth/register', { body: { role: 'NGO', name: 'No Org', email: `noorg${stamp}@test.org`, password: PW } });
ok(r.status === 400, 'NGO registration requires an organization');
const V = await signUp('Victim', 'victim2'), V0 = { token: (await call('POST', '/auth/login', { body: { email: vEmail, password: PW, role: 'Victim' } })).data.token };
const VOL = await signUp('Volunteer', 'vol1', { zone: 'Lakeview' }), VOL2 = await signUp('Volunteer', 'vol2');
const NGO = await signUp('NGO', 'ngo', { organization: `Relief Org ${stamp}` }), GOV = await signUp('Government Official', 'gov', { department: 'State Disaster Management Authority (TNSDMA)', designation: 'Commissioner' });
ok(V.token && VOL.token && VOL2.token && NGO.token && GOV.token, 'all four roles register and then log in');
ok(V.user.familySize === '1 member' && VOL.user.zone === 'Lakeview' && NGO.user.organization.startsWith('Relief Org'), 'role-specific profile fields saved');
ok((await call('GET', '/bootstrap')).status === 401 && (await call('GET', '/bootstrap', { token: 'junk' })).status === 401, 'bootstrap requires a valid token');

console.log('FRESH ACCOUNTS START EMPTY');
let bv = (await call('GET', '/bootstrap', { token: V.token })).data;
ok(bv.requests.length === 0 && bv.shelters.length === 4, 'new victim has no requests; shelters (reference data) visible');
let bn = (await call('GET', '/bootstrap', { token: NGO.token })).data;
ok(bn.inventory.length === 0 && bn.ngoVolunteers.length === 0, 'new NGO starts with empty inventory/roster');
ok((await call('GET', '/bootstrap', { token: VOL.token })).data.assignments.length === 0, 'new volunteer sees an empty pool');
ok((await call('GET', '/gov/zones', { token: V.token })).status === 403 && (await call('POST', '/inventory', { token: V.token, body: {} })).status === 403, 'role isolation enforced');

console.log('VICTIM -> VOLUNTEER -> NGO');
await call('PATCH', '/me', { token: V.token, body: { familySize: '4 members' } });
for (const it of [['Food Packs', 'Food', 100], ['Water Bottles', 'Water', 100], ['First Aid Kits', 'Medical', 10]]) {
  r = await call('POST', '/inventory', { token: NGO.token, body: { name: it[0], category: it[1], quantity: it[2], unit: 'Units', minThreshold: 20, campLocation: 'Hub 1' } });
}
ok(r.status === 201 && r.data.item.id === 'SUP-103', 'NGO adds its own inventory -> ' + r.data.item?.id);
const inv0 = (await call('GET', '/inventory', { token: NGO.token })).data.inventory;
r = await call('POST', '/requests', { token: V.token, body: { disasterType: 'Flood', category: 'Food & Water', urgency: 'Critical', location: 'Test Street', details: 'Need water' } });
ok(r.status === 201 && r.data.request.id === 'REQ-1001', 'victim creates request -> ' + r.data.request?.id);
const rid = r.data.request.id;
ok((await call('POST', '/requests', { token: V.token, body: { disasterType: 'Flood', category: 'Nope', urgency: 'Critical', location: 'x', details: 'y' } })).status === 400, 'invalid category -> 400');
ok((await call('GET', '/assignments', { token: VOL.token })).data.assignments.some(x => x.id === rid && x.status === 'Pending'), 'request appears in volunteer pool');
ok((await call('POST', `/assignments/${rid}/accept`, { token: VOL.token })).status === 200, 'volunteer accepts');
ok((await call('POST', `/assignments/${rid}/accept`, { token: VOL2.token })).status === 409, 'second volunteer cannot double-claim');
ok((await call('POST', `/assignments/${rid}/complete`, { token: VOL.token })).status === 409, 'cannot complete before starting');
let req = (await call('GET', `/requests/${rid}`, { token: V.token })).data.request;
ok(req.status === 'Matched' && req.assignedTo.startsWith('vol1 user'), 'victim sees request Matched to the volunteer');
await call('POST', `/assignments/${rid}/start`, { token: VOL.token });
req = (await call('GET', `/requests/${rid}`, { token: V.token })).data.request;
ok(req.status === 'Enroute' && req.timeline.some(t => t.current), 'request Enroute');
const before = (await call('GET', '/auth/me', { token: VOL.token })).data.user;
ok((await call('POST', `/assignments/${rid}/complete`, { token: VOL.token })).status === 200, 'volunteer completes');
req = (await call('GET', `/requests/${rid}`, { token: V.token })).data.request;
ok(req.status === 'Resolved' && req.timeline.every(t => t.completed), 'request Resolved with full timeline');
ok((await call('GET', '/auth/me', { token: VOL.token })).data.user.tasksCompleted === before.tasksCompleted + 1, 'volunteer stats incremented');
ok((await call('POST', `/requests/${rid}/cancel`, { token: V.token })).status === 409, 'cannot cancel a resolved request');
ok((await call('GET', `/requests/${rid}`, { token: VOL2.token })).status === 403, 'volunteer cannot read victim request');
ok((await call('GET', `/requests/${rid}`, { token: V0.token })).status === 404, "another victim cannot see this victim's request");

console.log('NGO ACTIONS');
r = await call('POST', '/requests', { token: V.token, body: { disasterType: 'Flood', category: 'Food & Water', urgency: 'High', location: 'Lane 2', details: 'Rations please' } });
const rid2 = r.data.request.id;
r = await call('POST', `/requests/${rid2}/dispatch-supplies`, { token: NGO.token });
ok(r.status === 200 && r.data.request.status === 'Enroute', 'dispatch consignment -> Enroute');
let inv = (await call('GET', '/inventory', { token: NGO.token })).data.inventory;
ok(inv.find(i => i.name === 'Food Packs').quantity === 96 && inv.find(i => i.name === 'Water Bottles').quantity === 96, 'inventory deducted by household size (4)');
r = await call('POST', `/requests/${rid2}/fulfill`, { token: NGO.token, body: {} });
inv = (await call('GET', '/inventory', { token: NGO.token })).data.inventory;
ok(r.status === 200 && inv.find(i => i.name === 'Food Packs').quantity === 96, 'fulfil resolves without double-deducting');
ok((await call('POST', `/requests/${rid2}/fulfill`, { token: NGO.token, body: {} })).status === 409, 'fulfilling twice -> 409');
r = await call('POST', '/requests', { token: V.token, body: { disasterType: 'Cyclone', category: 'Shelter', urgency: 'Medium', location: 'Coast', details: 'Roof damaged' } });
const rid3 = r.data.request.id;
await call('POST', `/assignments/${rid3}/reject`, { token: VOL.token });
r = await call('POST', `/requests/${rid3}/deploy-volunteers`, { token: NGO.token });
ok(r.status === 409, 'deploy volunteers when already in pool -> 409');
const sid = inv.find(i => i.name === 'First Aid Kits').id;
ok((await call('POST', `/inventory/${sid}/dispatch`, { token: NGO.token, body: { amount: 9999 } })).status === 409, 'over-dispatch blocked (never negative)');
r = await call('POST', `/inventory/${sid}/restock`, { token: NGO.token, body: { amount: 100 } });
ok(r.status === 200 && r.data.item.status === 'Adequate', 'restock recalculates status');
ok((await call('GET', '/inventory', { token: GOV.token })).status === 403, 'government cannot use NGO inventory');
const other = await signUp('NGO', 'ngo2', { organization: `Other Org ${stamp}` });
ok((await call('GET', '/inventory', { token: other.token })).data.inventory.length === 0, "another NGO cannot see this NGO's stock");

console.log('GOVERNMENT ACTIONS');
r = await call('POST', `/requests/${rid3}/escalate`, { token: GOV.token });
ok(r.status === 200 && r.data.request.assignedTo.includes('NDRF'), 'escalate to NDRF');
ok((await call('POST', `/requests/${rid3}/escalate`, { token: GOV.token })).status === 409, 'escalate twice -> 409');
r = await call('POST', '/requests', { token: V.token, body: { disasterType: 'Flood', category: 'Medical', urgency: 'High', location: 'Clinic Rd', details: 'Insulin' } });
r = await call('POST', `/requests/${r.data.request.id}/route-ngo`, { token: GOV.token });
ok(r.status === 200 && r.data.request.status === 'Matched', 'route to NGO partner');
r = await call('PATCH', '/gov/zones/DIS-01/status', { token: GOV.token, body: { status: 'Containment in Progress' } });
ok(r.status === 200 && r.data.zone.lastUpdated === 'Just now', 'zone status updated');
ok((await call('PATCH', '/gov/zones/DIS-01/status', { token: GOV.token, body: { status: 'bogus' } })).status === 400, 'invalid zone status -> 400');
ok((await call('PATCH', '/gov/agencies/AGY-05/sector', { token: GOV.token, body: { sector: 'Zone 4' } })).data.agency.status === 'Deployed', 'agency reassigned');
r = await call('POST', '/shelters/sh-red-cross/expand', { token: GOV.token, body: { additionalSpace: 50 } });
ok(r.status === 200 && r.data.shelter.capacity === 150, 'shelter expanded');
ok((await call('POST', '/shelters/sh-red-cross/audit', { token: GOV.token })).status === 200, 'shelter audit');
r = await call('POST', '/announcements', { token: GOV.token, body: { title: 'TEST ALERT', message: 'Stay safe', type: 'warning', zone: 'All' } });
ok(r.status === 201 && r.data.announcement.issuedBy === 'TNSDMA State Disaster Operations Center', 'broadcast alert issuer: ' + r.data.announcement?.issuedBy);
ok((await call('POST', '/announcements', { token: NGO.token, body: { title: 'x', message: 'yyy', type: 'info', zone: 'z' } })).status === 403, 'NGO cannot broadcast');
r = await call('GET', '/reports/summary', { token: GOV.token });
const sm = r.data.summary;
ok(r.status === 200 && sm.categories.length === 4 && sm.requestsTotal === 4 && sm.requestsResolved === 2, 'report summary counts real data: ' + JSON.stringify({ total: sm.requestsTotal, resolved: sm.requestsResolved }));
r = await call('GET', '/reports/export?format=csv', { token: GOV.token, raw: true });
ok(r.status === 200 && (await r.text()).includes(rid), 'CSV export contains real requests');
r = await call('GET', '/reports/export?format=pdf', { token: GOV.token, raw: true });
const pdf = Buffer.from(await r.arrayBuffer());
ok(r.status === 200 && pdf.slice(0, 4).toString() === '%PDF', 'PDF export');
ok((await call('GET', '/reports/export?format=csv', { token: NGO.token, raw: true })).status === 403, 'NGO cannot export reports');

console.log('SHELTERS / PROFILE');
r = await call('POST', '/shelters/sh-anna-nagar/reserve', { token: V.token });
ok(r.status === 200 && r.data.shelter.occupancy === 118, 'reserve shelter for household of 4 (114 -> 118)');
ok((await call('POST', '/shelters/sh-anna-nagar/reserve', { token: V.token })).status === 409, 'double reserve -> 409');
await call('POST', '/shelters/sh-community-hall/reserve', { token: V.token });
const sh = (await call('GET', '/shelters')).data.shelters;
ok(sh.find(s => s.id === 'sh-anna-nagar').occupancy === 114 && sh.find(s => s.id === 'sh-community-hall').occupancy === 43, 'moving reservation releases the old shelter');
ok((await call('PUT', '/me/safe', { token: V.token, body: { isSafe: true } })).data.user.isSafe === true, 'mark safe');
r = await call('PATCH', '/me', { token: V.token, body: { name: 'Renamed Person' } });
ok(r.status === 200 && r.data.user.name === 'Renamed Person', 'profile edit');
ok((await call('PATCH', '/me', { token: V.token, body: { email: VOL.email } })).status === 409, 'duplicate email on profile edit -> 409');
r = await call('PUT', '/me/preferences', { token: V.token, body: { darkMode: true, hacker: true } });
ok(r.data.user.preferences.darkMode === true && !('hacker' in r.data.user.preferences), 'preferences saved, unknown keys ignored');
await call('PUT', '/me/availability', { token: VOL2.token, body: { availability: 'OFFLINE' } });
r = await call('POST', '/requests', { token: V.token, body: { disasterType: 'Flood', category: 'Rescue', urgency: 'Critical', location: 'River', details: 'Trapped' } });
ok((await call('POST', `/assignments/${r.data.request.id}/accept`, { token: VOL2.token })).status === 409, 'OFFLINE volunteer cannot accept');

console.log('SOS');
r = await call('POST', '/sos', { body: { emergencyType: 'Medical Emergency' } });
ok(r.status === 201 && r.data.alert.userName === 'Emergency User', 'anonymous SOS works -> ' + r.data.alert?.requestId);
r = await call('POST', '/sos', { token: V.token, body: { emergencyType: 'Trapped / Rescue Needed', latitude: 13.08, longitude: 80.27 } });
ok(r.status === 201 && r.data.alert.userName === 'Renamed Person', 'logged-in SOS uses the account identity');
ok((await call('GET', '/requests', { token: V.token })).data.requests.some(x => x.id === r.data.alert.linkedRequestId && x.urgency === 'Critical'), 'SOS appears as a Critical request');
ok((await call('GET', '/assignments', { token: VOL.token })).data.assignments.some(x => x.id === r.data.alert.linkedRequestId), 'SOS reaches the volunteer pool');
ok((await call('POST', '/sos', { body: { latitude: 999 } })).status === 400, 'SOS validates coordinates');

console.log('PASSWORD RESET');
r = await call('POST', '/auth/forgot-password', { body: { email: vEmail } });
ok(r.status === 200 && r.data.resetToken, 'forgot password issues token (dev)');
r = await call('POST', '/auth/reset-password', { body: { token: r.data.resetToken, password: 'Brandnewpass1' } });
ok(r.status === 200, 'reset password');
ok((await call('GET', '/auth/me', { token: V0.token })).status === 401, 'old session invalidated after reset');
ok((await call('POST', '/auth/login', { body: { email: vEmail, password: 'Brandnewpass1', role: 'Victim' } })).status === 200, 'login with new password');

console.log('PUBLIC / MISC');
r = await call('GET', '/public/landing');
ok(r.status === 200 && r.data.services.length === 5 && r.data.helplines.length === 4, 'landing data');
ok((await call('GET', '/nope')).status === 404, 'unknown API route -> JSON 404');
r = await fetch(base + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{bad' });
ok(r.status === 400, 'malformed JSON -> 400');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
