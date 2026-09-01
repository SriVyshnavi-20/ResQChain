import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VolunteerSidebar } from '../components/layout/VolunteerSidebar';
import { VolunteerMobileNav } from '../components/layout/VolunteerMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { AvailabilityStatus } from '../types';
import {
  Shield,
  MapPin,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Users,
  Radio
} from 'lucide-react';

export const VolunteerDashboard: React.FC = () => {
  const {
    user,
    volunteerAvailability,
    setVolunteerAvailability,
    assignments,
    acceptAssignment,
    openSosModal
  } = useAuth();
  const navigate = useNavigate();

  const activeAssignments = assignments.filter(
    (a) => a.status === 'Pending' || a.status === 'Accepted' || a.status === 'Enroute'
  );

  const handleStatusChange = (status: AvailabilityStatus) => {
    setVolunteerAvailability(status);
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
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                Volunteer Field Terminal
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {user?.zone || 'Lakeview Zone'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Volunteer Dashboard
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

        {/* Main Content Body */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Greeting Hero Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 text-white shadow-md border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden sm:block">
              <Shield className="w-48 h-48 text-emerald-400" />
            </div>

            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {user?.zone || 'Lakeview Zone'}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                  <Clock className="w-3 h-3 text-blue-400" />
                  Shift: {user?.shift || '9:00 AM - 5:00 PM'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white pt-1">
                Hello, {user?.name || 'Priya'}!
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                You are currently deployed to <strong>Lakeview Zone</strong>. Emergency dispatches and local rescue requests are active in your proximity.
              </p>
            </div>
          </div>

          {/* 4 Summary Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Tasks Completed */}
            <Card padding="md" className="bg-white border-slate-200">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tasks Completed</span>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-navy-900 font-mono">
                {user?.tasksCompleted ?? 18}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Total lifetime relief missions</span>
            </Card>

            {/* 2. Active Tasks */}
            <Card padding="md" className="bg-white border-slate-200">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Tasks</span>
                <div className="p-2 rounded-lg bg-blue-50 text-brand-700">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-brand-700 font-mono">
                {user?.activeTasks ?? 2}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">In progress / claimed</span>
            </Card>

            {/* 3. Available Tasks */}
            <Card padding="md" className="bg-white border-slate-200">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Tasks</span>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                  <AlertOctagon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-amber-700 font-mono">
                {user?.availableTasks ?? 5}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Near Lakeview sector</span>
            </Card>

            {/* 4. People Assisted */}
            <Card padding="md" className="bg-white border-slate-200">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">People Assisted</span>
                <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-purple-700 font-mono">
                {user?.peopleAssisted ?? 42}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Citizens helped to safety</span>
            </Card>
          </div>

          {/* Prominent Volunteer Availability Card */}
          <Card padding="lg" className="bg-white border-slate-200/90 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Dispatch Status</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Volunteer Availability
                </h3>
              </div>

              {/* Status Buttons */}
              <div className="flex items-center gap-2">
                {(['ACTIVE', 'STANDBY', 'OFFLINE'] as AvailabilityStatus[]).map((status) => {
                  const isSelected = volunteerAvailability === status;
                  const btnStyles = {
                    ACTIVE: isSelected ? 'bg-emerald-600 text-white font-bold shadow-sm ring-2 ring-emerald-500/30' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                    STANDBY: isSelected ? 'bg-amber-600 text-white font-bold shadow-sm ring-2 ring-amber-500/30' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                    OFFLINE: isSelected ? 'bg-slate-800 text-white font-bold shadow-sm ring-2 ring-slate-700/30' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  };

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleStatusChange(status)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${btnStyles[status]}`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full shrink-0 ${
                volunteerAvailability === 'ACTIVE'
                  ? 'bg-emerald-500 animate-pulse'
                  : volunteerAvailability === 'STANDBY'
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
              }`} />
              <p className="text-xs sm:text-sm font-medium text-slate-700">
                {volunteerAvailability === 'ACTIVE' && 'Ready to receive emergency assignments.'}
                {volunteerAvailability === 'STANDBY' && 'On standby. You will only be alerted for critical rescue emergencies.'}
                {volunteerAvailability === 'OFFLINE' && 'Currently unavailable for assignments.'}
              </p>
            </div>
          </Card>

          {/* Active Assignments Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600" />
                Active Assignments
              </h3>
              <button
                type="button"
                onClick={() => navigate('/volunteer/assignments')}
                className="text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors flex items-center gap-1 cursor-pointer"
              >
                View All ({assignments.length}) &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAssignments.slice(0, 4).map((assignment) => {
                const isCritical = assignment.severity === 'Critical';
                return (
                  <Card
                    key={assignment.id}
                    padding="lg"
                    className="bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-500">
                              {assignment.id}
                            </span>
                            <StatusBadge
                              variant={isCritical ? 'emergency' : 'warning'}
                              label={assignment.severity.toUpperCase()}
                              size="sm"
                            />
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-1">
                            {assignment.emergencyType}
                          </h4>
                        </div>

                        <span className="inline-flex text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg shrink-0">
                          {assignment.distanceKm} km
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-slate-600 mt-2">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>Location: <strong>{assignment.location}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Time: <strong>{assignment.time}</strong></span>
                        </div>
                      </div>

                      {assignment.notes && (
                        <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          {assignment.notes}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-slate-100 grid grid-cols-2 gap-2.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/volunteer/assignments/${assignment.id}`)}
                      >
                        VIEW DETAILS
                      </Button>

                      {assignment.status === 'Pending' ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => acceptAssignment(assignment.id)}
                        >
                          ACCEPT
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/volunteer/assignments/${assignment.id}`)}
                          className={assignment.status === 'Enroute' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                        >
                          {assignment.status.toUpperCase()}
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
