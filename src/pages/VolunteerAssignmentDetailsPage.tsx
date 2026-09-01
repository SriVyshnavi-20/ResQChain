import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { VolunteerSidebar } from '../components/layout/VolunteerSidebar';
import { VolunteerMobileNav } from '../components/layout/VolunteerMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  MapPin,
  User,
  CheckCircle2,
  Compass,
  XCircle,
  ShieldCheck,
  Radio
} from 'lucide-react';

export const VolunteerAssignmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    assignments,
    acceptAssignment,
    startJourney,
    markAssignmentCompleted,
    rejectAssignment,
    openSosModal
  } = useAuth();
  const navigate = useNavigate();

  const assignment = assignments.find((a) => a.id === id) || assignments[0];

  const handleReject = () => {
    rejectAssignment(assignment.id);
    navigate('/volunteer/assignments');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'resolved';
      case 'Enroute':
      case 'Accepted':
        return 'warning';
      case 'Pending':
        return 'info';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <VolunteerMobileNav />
      <VolunteerSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/volunteer/assignments"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  Mission Dispatch
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-mono font-bold text-navy-900">{assignment.id}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                {assignment.emergencyType}
              </h1>
            </div>
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
        <div className="p-4 sm:p-8 max-w-4xl w-full mx-auto space-y-6">
          
          <Card padding="lg" className="bg-white border-slate-200 shadow-sm space-y-6">
            
            {/* Mission Overview Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black font-mono text-navy-900">
                    {assignment.id}
                  </span>
                  <StatusBadge
                    variant={getStatusBadgeVariant(assignment.status)}
                    label={assignment.status.toUpperCase()}
                    size="md"
                  />
                </div>
                <p className="text-base font-bold text-slate-800 mt-1">
                  Emergency: <span className="text-navy-900">{assignment.emergencyType}</span>
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center shrink-0">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Proximity</span>
                <span className="text-xl font-mono font-bold text-navy-900">{assignment.distanceKm} km</span>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Location</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  {assignment.location}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Severity</span>
                <span className="font-bold text-red-600 mt-1 block">
                  {assignment.severity.toUpperCase()} Priority
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Requester</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-1">
                  <User className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  {assignment.requester}
                </span>
              </div>
            </div>

            {/* Situation notes */}
            {assignment.notes && (
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-950 space-y-1">
                <span className="font-bold block">Incident Dispatch Notes:</span>
                <p className="leading-relaxed">{assignment.notes}</p>
              </div>
            )}

            {/* Lifecycle State Progress Timeline */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600" />
                Mission Lifecycle Status
              </h3>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {(['Pending', 'Accepted', 'Enroute', 'Completed'] as const).map((st, idx) => {
                  const isCurrent = assignment.status === st;
                  const stepIndex = ['Pending', 'Accepted', 'Enroute', 'Completed'].indexOf(assignment.status);
                  const isPassed = stepIndex >= idx;

                  return (
                    <div
                      key={st}
                      className={`p-3 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-navy-900 text-white border-navy-900 font-bold shadow-xs'
                          : isPassed
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                          : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="text-[10px] opacity-70">Step {idx + 1}</div>
                      <div className="mt-0.5">{st}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step-by-Step Action Controls */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* State 1: Pending */}
              {assignment.status === 'Pending' && (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    onClick={handleReject}
                    leftIcon={<XCircle className="w-4 h-4 text-red-500" />}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    REJECT
                  </Button>

                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => acceptAssignment(assignment.id)}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    ACCEPT ASSIGNMENT
                  </Button>
                </>
              )}

              {/* State 2: Accepted */}
              {assignment.status === 'Accepted' && (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => startJourney(assignment.id)}
                  className="bg-amber-600 hover:bg-amber-700"
                  leftIcon={<Compass className="w-4 h-4 animate-spin" />}
                >
                  START JOURNEY (ENROUTE)
                </Button>
              )}

              {/* State 3: Enroute */}
              {assignment.status === 'Enroute' && (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => markAssignmentCompleted(assignment.id)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  MARK COMPLETED
                </Button>
              )}

              {/* State 4: Completed */}
              {assignment.status === 'Completed' && (
                <div className="w-full p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center flex items-center justify-center gap-2 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Mission Successfully Completed &amp; Verified!
                </div>
              )}

            </div>

          </Card>
        </div>
      </main>
    </div>
  );
};
