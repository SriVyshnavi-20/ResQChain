import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GovSidebar } from '../components/layout/GovSidebar';
import { GovMobileNav } from '../components/layout/GovMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Radio,
  FileText,
  Users,
  Home,
  AlertOctagon,
  ShieldAlert,
  Plus
} from 'lucide-react';

export const GovDashboard: React.FC = () => {
  const { user, disasterZones, requests, govAgencies, shelters, openSosModal } = useAuth();
  const navigate = useNavigate();

  const activeCrises = disasterZones.filter((z) => z.status === 'Active Crisis');
  const criticalRequests = requests.filter((r) => r.urgency === 'Critical');
  const totalShelterOccupancy = shelters.reduce((acc, s) => acc + s.occupancy, 0);

  const getSeverityBadgeVariant = (sev: string) => {
    if (sev.includes('Critical') || sev.includes('Red')) return 'emergency';
    if (sev.includes('High') || sev.includes('Orange')) return 'warning';
    return 'info';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <GovMobileNav />
      <GovSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                State Emergency Command &amp; Operations Center
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">{user?.department || 'TNSDMA Statewide Operations'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Government Executive Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/government/alerts')}
              leftIcon={<Plus className="w-4 h-4 text-red-600" />}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              Broadcast Alert
            </Button>
            <Button
              variant="sos"
              size="sm"
              onClick={openSosModal}
              className="shadow-sm font-bold"
            >
              EMERGENCY SOS
            </Button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Executive State Command Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-navy-950 text-white shadow-md border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden sm:block">
              <Building2 className="w-48 h-48 text-amber-400" />
            </div>

            <div className="relative z-10 max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold border border-red-500/30">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                STATE EMERGENCY PROTOCOL LEVEL 3 ACTIVE • CHENNAI METROPOLITAN REGION
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Tamil Nadu State Disaster Management Authority
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Incident Commander: <strong>{user?.name || 'R. Rajesh IAS'}</strong> ({user?.designation || 'Principal Secretary & Relief Commissioner'}) • Official ID: <strong>{user?.officialId || 'GOV-TN-IAS-109'}</strong>
              </p>
            </div>
          </div>

          {/* 6 Executive KPI Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* 1. Active Disasters */}
            <Card padding="sm" className="bg-white border-slate-200 text-center">
              <div className="flex items-center justify-center gap-1.5 text-red-600 mb-1">
                <Radio className="w-4 h-4 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Crises</span>
              </div>
              <div className="text-2xl font-black text-red-600 font-mono">
                {activeCrises.length}
              </div>
              <span className="text-[10px] text-slate-400">Adyar &amp; Marina</span>
            </Card>

            {/* 2. Total Requests Logged */}
            <Card padding="sm" className="bg-white border-slate-200 text-center">
              <div className="flex items-center justify-center gap-1.5 text-navy-800 mb-1">
                <FileText className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Distress Calls</span>
              </div>
              <div className="text-2xl font-black text-navy-900 font-mono">
                1,840
              </div>
              <span className="text-[10px] text-slate-400">Across 8 zones</span>
            </Card>

            {/* 3. Requests Resolved */}
            <Card padding="sm" className="bg-white border-slate-200 text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Resolved</span>
              </div>
              <div className="text-2xl font-black text-emerald-700 font-mono">
                1,420
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">77.2% clearance</span>
            </Card>

            {/* 4. Sheltered Citizens */}
            <Card padding="sm" className="bg-white border-slate-200 text-center">
              <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1">
                <Home className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Sheltered</span>
              </div>
              <div className="text-2xl font-black text-blue-700 font-mono">
                {totalShelterOccupancy.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">19 relief centers</span>
            </Card>

            {/* 5. Deployed Battalions */}
            <Card padding="sm" className="bg-white border-slate-200 text-center">
              <div className="flex items-center justify-center gap-1.5 text-purple-600 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Battalions</span>
              </div>
              <div className="text-2xl font-black text-purple-700 font-mono">
                14
              </div>
              <span className="text-[10px] text-slate-400">NDRF &amp; Police QRT</span>
            </Card>

            {/* 6. Active Partner NGOs */}
            <Card padding="sm" className="bg-white border-slate-200 text-center">
              <div className="flex items-center justify-center gap-1.5 text-amber-600 mb-1">
                <Building2 className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">NGO Partners</span>
              </div>
              <div className="text-2xl font-black text-amber-700 font-mono">
                8
              </div>
              <span className="text-[10px] text-slate-400">Red Cross, YRB...</span>
            </Card>
          </div>

          {/* 2-Column: Active Disaster Zones & Response Coordination */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col: Active Disaster Incident Zones (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-600" />
                  Live Incident Surveillance &amp; Inundation Zones
                </h3>
                <button
                  type="button"
                  onClick={() => navigate('/government/monitoring')}
                  className="text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors cursor-pointer"
                >
                  Disaster Radar &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {disasterZones.map((zone) => {
                  const isCrisis = zone.status === 'Active Crisis';
                  const isContainment = zone.status === 'Containment in Progress';
                  const evacPct = Math.round((zone.evacuatedCount / zone.affectedPopulation) * 100);

                  return (
                    <Card
                      key={zone.id}
                      hoverable
                      onClick={() => navigate('/government/monitoring')}
                      padding="md"
                      className="bg-white border border-slate-200/90 hover:border-red-400 hover:shadow-md transition-all cursor-pointer space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-400">{zone.id}</span>
                            <h4 className="text-sm font-bold text-slate-900">{zone.name}</h4>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Affected Sectors: <strong>{zone.affectedAreas.join(', ')}</strong>
                          </p>
                        </div>

                        <StatusBadge
                          variant={getSeverityBadgeVariant(zone.severity)}
                          label={zone.severity}
                          size="sm"
                        />
                      </div>

                      {/* Evacuation Meter */}
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">
                            Evacuation Progress: <strong className="text-navy-900">{zone.evacuatedCount.toLocaleString()} / {zone.affectedPopulation.toLocaleString()}</strong> citizens
                          </span>
                          <span className="font-bold font-mono text-emerald-700">{evacPct}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full ${isCrisis ? 'bg-red-500' : isContainment ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${evacPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Deployments: <strong>{zone.activeTeams}</strong></span>
                        <span className="text-red-700 font-semibold">{zone.lastUpdated}</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Right Col: Multi-Agency Taskforce Matrix (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  Multi-Agency Deployment Matrix
                </h3>
                <button
                  type="button"
                  onClick={() => navigate('/government/coordination')}
                  className="text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors cursor-pointer"
                >
                  Coordinate &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {govAgencies.map((agency) => (
                  <Card key={agency.id} padding="sm" className="bg-white border-slate-200 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                        {agency.type}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{agency.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Lead: {agency.commandLead} • Sector: <strong>{agency.assignedSector}</strong>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold font-mono text-navy-900 block">{agency.activePersonnel} Troops</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block mt-0.5">
                        {agency.status}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

          </div>

          {/* Priority Requests Escalation Queue */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                Critical Citizen Distress Requests (Requiring Armed Forces / Heavy Machinery)
              </h3>
              <button
                type="button"
                onClick={() => navigate('/government/requests')}
                className="text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors cursor-pointer"
              >
                Executive Queue &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {criticalRequests.slice(0, 2).map((req) => (
                <Card key={req.id} padding="md" className="bg-white border-slate-200 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">{req.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                      CRITICAL PRIORITY
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{req.requestTitle}</h4>
                  <p className="text-xs text-slate-600">📍 {req.location} • Requester: <strong>{req.victimName}</strong></p>
                  <p className="text-xs text-slate-500 leading-snug">{req.details}</p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Assigned: {req.assignedTo || 'Pending Command'}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/government/requests')}
                      className="text-xs"
                    >
                      Manage Ticket
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
