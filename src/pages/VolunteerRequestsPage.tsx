import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VolunteerSidebar } from '../components/layout/VolunteerSidebar';
import { VolunteerMobileNav } from '../components/layout/VolunteerMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import {
  AlertOctagon,
  MapPin,
  Clock,
  Compass,
  CheckCircle2
} from 'lucide-react';

export const VolunteerRequestsPage: React.FC = () => {
  const { assignments, acceptAssignment, openSosModal } = useAuth();
  const navigate = useNavigate();

  const openRequests = assignments.filter((a) => a.status === 'Pending');

  const getSeverityBadgeVariant = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'emergency';
      case 'High':
        return 'warning';
      case 'Medium':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const handleAccept = async (id: string) => {
    const ok = await acceptAssignment(id);
    if (ok) navigate(`/volunteer/assignments/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <VolunteerMobileNav />
      <VolunteerSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                Live Dispatch Queue
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">{openRequests.length} Pending Volunteer Claims</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Available Requests
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
          
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-sm font-bold block">Open Volunteer Pool</span>
              <p className="text-xs text-amber-900/90 mt-0.5">
                These distress tickets have been logged by citizens in your response zone. Accept a ticket to assign it to your roster.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {openRequests.length === 0 ? (
              <div className="p-12 bg-white rounded-xl border border-slate-200 text-center text-slate-500">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
                <h3 className="font-bold text-slate-800">All emergency requests in your zone are claimed!</h3>
                <p className="text-xs text-slate-500 mt-1">Stand by for new incoming citizen dispatches.</p>
              </div>
            ) : (
              openRequests.map((req) => (
                <Card
                  key={req.id}
                  padding="lg"
                  className="bg-white border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left info */}
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-xl bg-slate-100 text-navy-900 font-mono font-bold text-xs shrink-0">
                      {req.id}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {req.emergencyType}
                        </h3>
                        <StatusBadge
                          variant={getSeverityBadgeVariant(req.severity)}
                          label={req.severity.toUpperCase()}
                          size="sm"
                        />
                      </div>

                      <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <strong>Location:</strong> {req.location}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1.5">
                        <span className="flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5 text-slate-400" />
                          Distance: <strong className="text-navy-900 font-mono">{req.distanceKm} km</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Reported: {req.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/volunteer/assignments/${req.id}`)}
                    >
                      VIEW
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAccept(req.id)}
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      ACCEPT
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  );
};
