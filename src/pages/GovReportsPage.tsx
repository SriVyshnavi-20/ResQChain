import React from 'react';
import { GovSidebar } from '../components/layout/GovSidebar';
import { GovMobileNav } from '../components/layout/GovMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
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
  const { showToast } = useAuth();

  const handleExport = (format: string) => {
    showToast(`Generating and exporting official SITREP Report (${format})...`);
  };

  const categories = [
    { name: 'Food & Drinking Water Rations', count: 740, pct: 40, color: 'bg-emerald-500' },
    { name: 'Medical First Aid & Insulin Aid', count: 480, pct: 26, color: 'bg-blue-500' },
    { name: 'Rescue & Flood Boat Evacuations', count: 350, pct: 19, color: 'bg-red-500' },
    { name: 'Shelter Accommodation & Bedding', count: 270, pct: 15, color: 'bg-purple-500' }
  ];

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
              onClick={() => handleExport('CSV')}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleExport('PDF')}
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
                99.8%
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
                25,100+
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
                1,420 / 1,840
              </div>
              <span className="text-xs text-slate-400 mt-1 block">77.2% overall clearance</span>
            </Card>

            <Card padding="md" className="bg-white border-slate-200">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Response Time</span>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-amber-700 font-mono">
                14.2 min
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
                <span className="text-xs text-slate-500">1,840 Total Inflows</span>
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
                    <span className="text-slate-500">45,000 packs distributed across 19 camps</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 text-sm">45,000</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Clean Drinking Water Bottles</span>
                    <span className="text-slate-500">120,000 Liters delivered by NGO supply trucks</span>
                  </div>
                  <span className="font-mono font-bold text-blue-700 text-sm">120,000 L</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Medical Trauma &amp; First Aid Kits</span>
                    <span className="text-slate-500">3,200 kits provisioned to mobile doctors</span>
                  </div>
                  <span className="font-mono font-bold text-purple-700 text-sm">3,200</span>
                </div>
              </div>
            </Card>

          </div>

        </div>
      </main>
    </div>
  );
};
