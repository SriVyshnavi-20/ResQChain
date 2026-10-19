import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { audit } from '../lib/audit';
import { me, requireRole } from '../lib/auth';
import { badRequest } from '../lib/errors';
import { ago } from '../lib/time';
import { activeZonesForReport, buildReportSummary, requestLedger } from '../services/reports';

export const reportsRouter = Router();
reportsRouter.use(requireRole('Government Official'));

reportsRouter.get('/summary', (_req, res) => res.json({ summary: buildReportSummary() }));

/** Neutralise spreadsheet formula injection and quote for CSV. */
function csvCell(v: string): string {
  let s = v;
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

reportsRouter.get('/export', (req, res) => {
  const user = me(req);
  const format = String(req.query.format ?? '').toLowerCase();
  const stamp = new Date().toISOString().slice(0, 10);
  if (format !== 'csv' && format !== 'pdf') throw badRequest('format must be "csv" or "pdf".');
  audit(user, 'REPORT_EXPORTED', 'report', undefined, { format });

  if (format === 'csv') {
    const header = ['Request ID', 'Title', 'Category', 'Urgency', 'Status', 'Victim', 'Location', 'Assigned To', 'Logged (UTC)'];
    const lines = [header.join(',')];
    for (const r of requestLedger()) {
      lines.push([r.id, r.title, r.category, r.urgency, r.status, r.victim, r.location, r.assignedTo, r.logged].map(csvCell).join(','));
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="resqchain-sitrep-${stamp}.csv"`);
    res.send('\uFEFF' + lines.join('\r\n') + '\r\n');
    return;
  }

  const s = buildReportSummary();
  const doc = new PDFDocument({ size: 'A4', margin: 48, info: { Title: 'ResQChain SITREP', Author: user.name } });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="resqchain-sitrep-${stamp}.pdf"`);
  doc.pipe(res);

  const h2 = (t: string) => doc.moveDown(1).font('Helvetica-Bold').fontSize(12).fillColor('#0f172a').text(t.toUpperCase()).moveDown(0.3);
  const row = (k: string, v: string) => doc.font('Helvetica').fontSize(10).fillColor('#334155').text(`${k}: `, { continued: true }).font('Helvetica-Bold').text(v);

  doc.font('Helvetica-Bold').fontSize(20).fillColor('#0f172a').text('RESQCHAIN - SITUATION REPORT (SITREP)');
  doc.font('Helvetica').fontSize(10).fillColor('#64748b').text(`Generated ${new Date(s.generatedAt).toUTCString()} by ${user.name}`);

  h2('Executive overview');
  row('Timely response coverage (critical/high tickets)', `${s.casualtiesAvertedPct}%`);
  row('People evacuated and provisioned', s.peopleAssisted.toLocaleString('en-IN'));
  row('Requests resolved', `${s.requestsResolved} / ${s.requestsTotal} (${s.clearancePct}% clearance)`);
  row('Average time to responder match', `${s.avgResponseMinutes} min`);

  h2('Incident category distribution');
  for (const c of s.categories) row(c.name, `${c.count} tickets (${c.pct}%)`);

  h2('Relief logistics dispatched');
  row('Food rations', `${s.logistics.foodPacks.toLocaleString('en-IN')} packs across ${s.logistics.campCount} camps`);
  row('Drinking water', `${s.logistics.waterLitres.toLocaleString('en-IN')} L`);
  row('Medical kits', s.logistics.medicalKits.toLocaleString('en-IN'));

  h2('Disaster zones');
  for (const z of activeZonesForReport()) {
    row(z.name, `${z.disaster_type}, ${z.severity}, ${z.status}; ${z.evacuated_count.toLocaleString('en-IN')} of ${z.affected_population.toLocaleString('en-IN')} evacuated (updated ${ago(z.updated_at)})`);
  }

  const open = requestLedger().filter((r) => r.urgency === 'Critical' && r.status !== 'Resolved' && r.status !== 'Cancelled');
  h2(`Open critical tickets (${open.length})`);
  if (!open.length) doc.font('Helvetica').fontSize(10).fillColor('#334155').text('None.');
  for (const r of open.slice(0, 40)) row(r.id, `${r.title} - ${r.location} [${r.status}]`);

  doc.end();
});
