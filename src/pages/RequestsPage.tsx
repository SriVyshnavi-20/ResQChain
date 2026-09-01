import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileNav } from '../components/layout/MobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Search,
  Plus,
  MapPin,
  UserCheck,
  ChevronRight
} from 'lucide-react';

export const RequestsPage: React.FC = () => {
  const { requests, openSosModal } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('All Zones');
  const [severityFilter, setSeverityFilter] = useState('All Severities');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.requestTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.assignedTo && r.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesZone = zoneFilter === 'All Zones' || r.location.includes(zoneFilter);
    const matchesSeverity = severityFilter === 'All Severities' || r.urgency === severityFilter;
    const matchesStatus = statusFilter === 'All Statuses' || r.status === statusFilter;

    return matchesSearch && matchesZone && matchesSeverity && matchesStatus;
  });

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'emergency';
      case 'High':
        return 'warning';
      case 'Medium':
        return 'info';
      case 'Low':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'resolved';
      case 'Enroute':
      case 'Matched':
        return 'warning';
      case 'Open':
        return 'info';
      case 'Cancelled':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <MobileNav />
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                Assistance Log
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">{requests.length} Total Submissions</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              MY REQUESTS
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/victim/report-emergency">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Report Emergency
              </Button>
            </Link>
            <Button
              variant="sos"
              size="sm"
              onClick={openSosModal}
              className="shadow-sm font-bold"
            >
              SOS
            </Button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Filter Bar */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID, request, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800 bg-slate-50/50"
                />
              </div>

              {/* Zone Filter */}
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="p-2 border border-slate-300 rounded-lg text-xs font-medium bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-navy-800"
              >
                <option value="All Zones">All Zones</option>
                <option value="Riverside">Riverside Zone</option>
                <option value="Downtown">Downtown Sector</option>
                <option value="East Colony">East Colony</option>
                <option value="Northside">Northside Sector</option>
              </select>

              {/* Severity Filter */}
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="p-2 border border-slate-300 rounded-lg text-xs font-medium bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-navy-800"
              >
                <option value="All Severities">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border border-slate-300 rounded-lg text-xs font-medium bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-navy-800"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Matched">Matched</option>
                <option value="Enroute">Enroute</option>
                <option value="Resolved">Resolved</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Requests Table / Cards */}
          <div className="space-y-3">
            {filteredRequests.length === 0 ? (
              <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-slate-500">
                <FileText className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="font-semibold">No assistance requests found matching your filter.</p>
              </div>
            ) : (
              filteredRequests.map((req) => (
                <Card
                  key={req.id}
                  hoverable
                  onClick={() => navigate(`/victim/request/${req.id}`)}
                  padding="md"
                  className="bg-white border border-slate-200/90 hover:border-brand-500 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Col 1: ID & Title */}
                    <div className="flex items-start gap-3 min-w-[200px]">
                      <div className="p-2.5 rounded-xl bg-slate-100 text-navy-900 font-mono font-bold text-xs shrink-0 mt-0.5">
                        {req.id}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                          {req.requestTitle}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          {req.location}
                        </p>
                      </div>
                    </div>

                    {/* Col 2: Severity & Status Badges */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Severity</span>
                        <StatusBadge
                          variant={getSeverityBadgeVariant(req.urgency)}
                          label={req.urgency}
                          size="sm"
                        />
                      </div>

                      <div className="flex flex-col items-start gap-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
                        <StatusBadge
                          variant={getStatusBadgeVariant(req.status)}
                          label={req.status}
                          size="sm"
                        />
                      </div>
                    </div>

                    {/* Col 3: Assigned Responder */}
                    <div className="text-xs text-slate-600 min-w-[150px]">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned To</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                        <UserCheck className="w-3.5 h-3.5 text-brand-600" />
                        {req.assignedTo || 'Unassigned'}
                      </span>
                    </div>

                    {/* Col 4: Action */}
                    <div className="flex items-center justify-end gap-2 shrink-0">
                      <span className="text-xs font-bold text-brand-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Track Live <ChevronRight className="w-4 h-4" />
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
