import React from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileNav } from '../components/layout/MobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  Clock,
  MapPin,
  Building2,
  Radio
} from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const { announcements, openSosModal } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <MobileNav />
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                Official Broadcast Feed
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">State Disaster Control Network</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              ANNOUNCEMENTS
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
        <div className="p-4 sm:p-8 max-w-5xl w-full mx-auto space-y-6">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-600 animate-pulse" />
              Real-Time Emergency Broadcasts
            </h2>
            <span className="text-xs text-slate-500">Verified by NDRF &amp; State Disaster Authority</span>
          </div>

          <div className="space-y-4">
            {announcements.map((ann) => {
              const isEmergency = ann.type === 'emergency';
              const isWarning = ann.type === 'warning';

              const bgStyle = isEmergency
                ? 'bg-red-50/80 border-red-200 text-red-950'
                : isWarning
                ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                : 'bg-sky-50/70 border-sky-200 text-sky-950';

              const iconBoxStyle = isEmergency
                ? 'bg-red-200/80 text-red-900'
                : isWarning
                ? 'bg-amber-200/80 text-amber-900'
                : 'bg-sky-200/80 text-sky-900';

              return (
                <Card
                  key={ann.id}
                  padding="lg"
                  className={`border shadow-xs ${bgStyle}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 ${iconBoxStyle}`}>
                        {isEmergency ? (
                          <ShieldAlert className="w-5 h-5" />
                        ) : isWarning ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : (
                          <Info className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-base font-extrabold tracking-tight ${isEmergency ? 'text-red-950' : isWarning ? 'text-amber-950' : 'text-sky-950'}`}>
                            {ann.title}
                          </h3>
                          <StatusBadge
                            variant={ann.type}
                            label={isEmergency ? 'Emergency' : isWarning ? 'Warning' : 'Information'}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 shrink-0">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {ann.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="py-3.5">
                    <p className={`text-sm leading-relaxed ${isEmergency ? 'text-red-950' : isWarning ? 'text-amber-950' : 'text-sky-950'}`}>
                      {ann.message}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <strong>Affected Zone:</strong> {ann.zone || 'All Lowland Sectors'}
                    </span>

                    {ann.issuedBy && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Building2 className="w-3.5 h-3.5" />
                        Issued by: {ann.issuedBy}
                      </span>
                    )}
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
