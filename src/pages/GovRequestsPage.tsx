import React, { useState } from 'react';
import { GovSidebar } from '../components/layout/GovSidebar';
import { GovMobileNav } from '../components/layout/GovMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  MapPin,
  Users,
  ShieldAlert,
  CheckCircle2,
  Building2
} from 'lucide-react';

export const GovRequestsPage: React.FC = () => {
  const { requests, escalateToNdrf, fulfillRequest, openSosModal, showToast } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.requestTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.victimName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUrgency = urgencyFilter === 'All' || r.urgency === urgencyFilter;
    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;

    return matchesSearch && matchesUrgency && matchesCategory;
  });

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

  const handleAssignToNgo = (id: string) => {
    showToast(`Request ${id} routed to Red Cross Disaster Relief Hub.`);
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
                State Incident Dispatch Ledger
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">{requests.length} Statewide Emergency Tickets</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Emergency Distress Requests
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
          
          {/* Search & Filter Controls */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ticket ID, citizen, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800 bg-slate-50/50"
              />
            </div>

            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="p-2 border border-slate-300 rounded-lg text-xs font-medium bg-slate-50/50 focus:ring-2 focus:ring-navy-800"
            >
              <option value="All">All Priority Levels</option>
              <option value="Critical">Critical (Life Threatening)</option>
              <option value="High">High Urgency</option>
              <option value="Medium">Medium Urgency</option>
              <option value="Low">Low Urgency</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2 border border-slate-300 rounded-lg text-xs font-medium bg-slate-50/50 focus:ring-2 focus:ring-navy-800"
            >
              <option value="All">All Incident Categories</option>
              <option value="Rescue">Rescue Evacuation</option>
              <option value="Medical">Medical Assistance</option>
              <option value="Food & Water">Food &amp; Water Rations</option>
              <option value="Shelter">Shelter &amp; Bedding</option>
              <option value="Supplies">Supplies</option>
            </select>
          </div>

          {/* Request Tickets List */}
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <Card
                key={req.id}
                padding="lg"
                className="bg-white border-slate-200/90 hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-slate-100 font-mono font-bold text-xs text-navy-900">
                      {req.id}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{req.requestTitle}</h3>
                        <StatusBadge
                          variant={getSeverityBadgeVariant(req.urgency)}
                          label={req.urgency.toUpperCase()}
                          size="sm"
                        />
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        {req.location} • Requester: <strong className="text-slate-800">{req.victimName}</strong> ({req.phone})
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-500 block">Logged: <strong>{req.timestamp}</strong></span>
                    <span className="text-xs text-navy-900 font-semibold">Assigned: {req.assignedTo || 'State Command Queue'}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-700">
                  <span className="font-bold block text-slate-900 mb-0.5">Situation Dispatch Note:</span>
                  <p>{req.details}</p>
                </div>

                {/* Government Command Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Family Size: <strong>{req.peopleCount || 4} persons</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status !== 'Resolved' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAssignToNgo(req.id)}
                          leftIcon={<Building2 className="w-3.5 h-3.5 text-brand-600" />}
                        >
                          Assign to NGO
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => escalateToNdrf(req.id)}
                          leftIcon={<ShieldAlert className="w-3.5 h-3.5" />}
                          className="bg-red-700 hover:bg-red-800"
                        >
                          ESCALATE TO NDRF
                        </Button>
                      </>
                    )}

                    {req.status !== 'Resolved' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => fulfillRequest(req.id, 'Resolved and closed under SDMA executive supervision.')}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        className="bg-emerald-700 hover:bg-emerald-800"
                      >
                        Mark Resolved
                      </Button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Ticket Resolved &amp; Verified
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};
