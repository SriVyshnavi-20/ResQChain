import React, { useState } from 'react';
import { GovSidebar } from '../components/layout/GovSidebar';
import { GovMobileNav } from '../components/layout/GovMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { DisasterZone } from '../types';
import {
  MapPin,
  Users,
  Compass,
  AlertOctagon,
  Search
} from 'lucide-react';

export const GovMonitoringPage: React.FC = () => {
  const { disasterZones, updateDisasterStatus, openSosModal } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredZones = disasterZones.filter(
    (z) =>
      z.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      z.disasterType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      z.affectedAreas.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getSeverityBadgeVariant = (sev: string) => {
    if (sev.includes('Critical') || sev.includes('Red')) return 'emergency';
    if (sev.includes('High') || sev.includes('Orange')) return 'warning';
    return 'info';
  };

  const handleStatusChange = (zoneId: string, nextStatus: DisasterZone['status']) => {
    updateDisasterStatus(zoneId, nextStatus);
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
              <span className="text-xs font-semibold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                Live Telemetry &amp; Geo-Surveillance
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">{disasterZones.length} Monitored Incident Sectors</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Disaster Incident Monitoring
            </h1>
          </div>

          <Button
            variant="sos"
            size="sm"
            onClick={openSosModal}
            className="shadow-sm font-bold"
          >
            EMERGENCY SOS
          </Button>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Top Search Bar */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search disaster zone, sector, type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Compass className="w-4 h-4 text-slate-400" />
              <span>Real-time GIS &amp; River Inundation Sensor Feed</span>
            </div>
          </div>

          {/* Disaster Zones Grid */}
          <div className="space-y-4">
            {filteredZones.map((zone) => {
              const isCrisis = zone.status === 'Active Crisis';
              const isContainment = zone.status === 'Containment in Progress';
              const evacPct = Math.round((zone.evacuatedCount / zone.affectedPopulation) * 100);

              return (
                <Card
                  key={zone.id}
                  padding="lg"
                  className="bg-white border-slate-200/90 shadow-sm space-y-5"
                >
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-xl bg-red-50 text-red-700 mt-0.5 shrink-0">
                        <AlertOctagon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {zone.id}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900">
                            {zone.name}
                          </h3>
                          <StatusBadge
                            variant={getSeverityBadgeVariant(zone.severity)}
                            label={zone.severity}
                            size="sm"
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          Affected Areas: <strong className="text-slate-800">{zone.affectedAreas.join(', ')}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                        isCrisis
                          ? 'bg-red-50 text-red-900 border-red-300'
                          : isContainment
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      }`}>
                        {zone.status}
                      </span>
                    </div>
                  </div>

                  {/* Evacuation Statistics & Progress Bar */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                      <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-brand-600" />
                        Evacuation Coverage: <strong className="text-navy-900 text-sm font-mono">{zone.evacuatedCount.toLocaleString()}</strong> of <span className="font-mono text-slate-600">{zone.affectedPopulation.toLocaleString()} citizens</span>
                      </span>
                      <span className="font-mono font-bold text-navy-900 text-sm">{evacPct}% Cleared</span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isCrisis ? 'bg-red-600' : isContainment ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${evacPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Assigned Taskforces: <strong className="text-slate-800">{zone.activeTeams}</strong></span>
                      <span className="text-red-700 font-semibold font-mono">Last telemetry ping: {zone.lastUpdated}</span>
                    </div>
                  </div>

                  {/* Incident Escalation Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-slate-600">Change Incident Status:</span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(zone.id, 'Active Crisis')}
                        className={`px-3 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer ${
                          zone.status === 'Active Crisis'
                            ? 'bg-red-700 text-white border-red-700'
                            : 'bg-white text-red-700 border-red-300 hover:bg-red-50'
                        }`}
                      >
                        Active Crisis (Red)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(zone.id, 'Containment in Progress')}
                        className={`px-3 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer ${
                          zone.status === 'Containment in Progress'
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50'
                        }`}
                      >
                        Containment in Progress
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(zone.id, 'Standby / Under Watch')}
                        className={`px-3 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer ${
                          zone.status === 'Standby / Under Watch'
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                        }`}
                      >
                        Standby / Under Watch
                      </button>
                    </div>
                  </div>

                </Card>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
};
