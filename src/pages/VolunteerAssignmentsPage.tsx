import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VolunteerSidebar } from '../components/layout/VolunteerSidebar';
import { VolunteerMobileNav } from '../components/layout/VolunteerMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import {
  ClipboardList,
  MapPin,
  Clock,
  ChevronRight,
  Search
} from 'lucide-react';

export const VolunteerAssignmentsPage: React.FC = () => {
  const { assignments, openSosModal } = useAuth();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<'All' | 'Pending' | 'Accepted' | 'Enroute' | 'Completed'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssignments = assignments.filter((item) => {
    const matchesFilter = filter === 'All' || item.status === filter;
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.emergencyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
                Dispatch Roster
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">{assignments.length} Total Registered</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              My Assignments
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
          
          {/* Filter Bar */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ID, emergency, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800 bg-slate-50/50"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {(['All', 'Pending', 'Accepted', 'Enroute', 'Completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    filter === status
                      ? 'bg-navy-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Assignments List */}
          <div className="space-y-3">
            {filteredAssignments.length === 0 ? (
              <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-slate-500">
                <ClipboardList className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="font-semibold">No assignments found for the selected status.</p>
              </div>
            ) : (
              filteredAssignments.map((assignment) => (
                <Card
                  key={assignment.id}
                  hoverable
                  onClick={() => navigate(`/volunteer/assignments/${assignment.id}`)}
                  padding="md"
                  className="bg-white border border-slate-200/90 hover:border-brand-500 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Col 1: ID & Emergency */}
                    <div className="flex items-start gap-3 min-w-[220px]">
                      <div className="p-2.5 rounded-xl bg-slate-100 text-navy-900 font-mono font-bold text-xs shrink-0 mt-0.5">
                        {assignment.id}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                          {assignment.emergencyType}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          {assignment.location}
                        </p>
                      </div>
                    </div>

                    {/* Col 2: Distance & Time */}
                    <div className="text-xs text-slate-600 space-y-1 shrink-0 min-w-[140px]">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Time: {assignment.time}
                      </div>
                      <div className="text-slate-500">
                        Distance: <strong className="text-navy-900 font-mono">{assignment.distanceKm} km</strong>
                      </div>
                    </div>

                    {/* Col 3: Severity & Status Badges */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Severity</span>
                        <StatusBadge
                          variant={getSeverityBadgeVariant(assignment.severity)}
                          label={assignment.severity}
                          size="sm"
                        />
                      </div>

                      <div className="flex flex-col items-start gap-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
                        <StatusBadge
                          variant={getStatusBadgeVariant(assignment.status)}
                          label={assignment.status.toUpperCase()}
                          size="sm"
                        />
                      </div>
                    </div>

                    {/* Col 4: Action */}
                    <div className="flex items-center justify-end gap-2 shrink-0">
                      <span className="text-xs font-bold text-brand-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        View Details <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>

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
