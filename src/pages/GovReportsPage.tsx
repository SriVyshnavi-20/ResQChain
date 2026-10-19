import React, { useEffect, useState } from 'react';
import { GovSidebar } from '../components/layout/GovSidebar';
import { GovMobileNav } from '../components/layout/GovMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { ReportSummary } from '../types';
import {
  BarChart3,
  Download,
  Users,
  CheckCircle2,
  Package,
  Clock,
  TrendingUp
} from 'lucide-react';

export const GovReportsPage: React.FC = () => {
  const { fetchReportSummary, exportReport } = useAuth();
  const [summary, setSummary] = useState<ReportSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchReportSummary().then((s) => {
      if (!cancelled && s) setSummary(s);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExport = (format: 'csv' | 'pdf') => {
    exportReport(format);
  };

  const num = (n: number | undefined) => (n === undefined ? '--' : n.toLocaleString('en-IN'));
  const categoryColors: Record<string, string> = {
    food: 'bg-emerald-500',
    medical: 'bg-blue-500',
    rescue: 'bg-red-500',
    shelter: 'bg-purple-500'
  };
  const categories = (summary?.categories ?? []).map((c) => ({
    name: c.name,
    count: c.count,
    pct: c.pct,
    color: categoryColors[c.key] ?? 'bg-slate-400'
  }));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <GovMobileNav />
      <GovSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Disaster Analytics &amp; SITREP Engine
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Statewide Emergency Performance Metrics</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Reports &amp; Situation Analysis (SITREP)
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleExport('pdf')}
              leftIcon={<Download className="w-4 h-4" />}
              className="bg-navy-900 hover:bg-navy-950"
            >
              Download PDF SITREP
            </Button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Executive Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card padding="md" className="bg-white border-slate-200">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Casualties Averted</span>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-emerald-700 font-mono">
                {summary ? `${summary.casualtiesAvertedPct}%` : '--'}
              </div>
              <span className="text-xs text-emerald-600 font-semibold mt-1 block">Timely evacuation success</span>
            </Card>

            <Card padding="md" className="bg-white border-slate-200">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">People Assisted</span>
                <div className="p-2 rounded-lg bg-blue-50 text-brand-700">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-navy-900 font-mono">
                {num(summary?.peopleAssisted)}
              </div>
              <span className="text-xs text-slate-400 mt-1 block">Evacuated &amp; provisioned</span>
            </Card>

            <Card padding="md" className="bg-white border-slate-200">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requests Resolved</span>
                <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-purple-700 font-mono">
                {summary ? `${num(summary.requestsResolved)} / ${num(summary.requestsTotal)}` : '--'}
              </div>
              <span className="text-xs text-slate-400 mt-1 block">{summary ? summary.clearancePct : '--'}% overall clearance</span>
            </Card>

            <Card padding="md" className="bg-white border-slate-200">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Response Time</span>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-amber-700 font-mono">
                {summary ? `${summary.avgResponseMinutes} min` : '--'}
              </div>
              <span className="text-xs text-slate-400 mt-1 block">From SOS trigger to field contact</span>
            </Card>
          </div>

          {/* 2-Column: Incident Category Distribution & Relief Supplies Burn */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Category Distribution */}
            <Card padding="lg" className="bg-white border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-brand-600" />
                  Incident Category Distribution
                </h3>
                <span className="text-xs text-slate-500">{num(summary?.requestsTotal)} Total Inflows</span>
              </div>

              <div className="space-y-3.5 pt-2">
                {categories.map((cat) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{cat.name}</span>
                      <span className="font-mono text-slate-600 font-bold">{cat.count} tickets ({cat.pct}%)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full ${cat.color}`}
                        style={{ width: `${cat.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Relief Supplies Logistics Burn */}
            <Card padding="lg" className="bg-white border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" />
                  State Relief Logistics Pipeline
                </h3>
                <span className="text-xs text-emerald-600 font-bold">● Active Supplies Flow</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Food Rations Dispatched</span>
                    <span className="text-slate-500">{num(summary?.logistics.foodPacks)} packs distributed across {summary?.logistics.campCount ?? '--'} camps</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 text-sm">{num(summary?.logistics.foodPacks)}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Clean Drinking Water Bottles</span>
                    <span className="text-slate-500">{num(summary?.logistics.waterLitres)} Liters delivered by NGO supply trucks</span>
                  </div>
                  <span className="font-mono font-bold text-blue-700 text-sm">{num(summary?.logistics.waterLitres)} L</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Medical Trauma &amp; First Aid Kits</span>
                    <span className="text-slate-500">{num(summary?.logistics.medicalKits)} kits provisioned to mobile doctors</span>
                  </div>
                  <span className="font-mono font-bold text-purple-700 text-sm">{num(summary?.logistics.medicalKits)}</span>
                </div>
              </div>
            </Card>

          </div>

        </div>
      </main>
    </div>
  );
};
