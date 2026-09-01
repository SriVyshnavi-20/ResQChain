import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NgoSidebar } from '../components/layout/NgoSidebar';
import { NgoMobileNav } from '../components/layout/NgoMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Package,
  Users,
  FileText,
  MapPin,
  AlertTriangle,
  Plus
} from 'lucide-react';

export const NgoDashboard: React.FC = () => {
  const { user, requests, inventory, ngoVolunteers, openSosModal } = useAuth();
  const navigate = useNavigate();

  const openRequests = requests.filter(r => r.status === 'Open' || r.status === 'Matched');
  const lowStockItems = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Critical');
  const onFieldVolunteers = ngoVolunteers.filter(v => v.status === 'On Field');

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
      <NgoMobileNav />
      <NgoSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                NGO Relief Operations Command
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Red Cross Disaster Relief Foundation</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              NGO Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/ngo/inventory')}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Restock Supplies
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
          
          {/* Operations Hero Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 text-white shadow-md border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden sm:block">
              <Building2 className="w-48 h-48 text-brand-400" />
            </div>

            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
                <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
                Relief Operations Hub Active • Sector Central &amp; South
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {user?.organization || 'Red Cross Disaster Relief Foundation'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Director: <strong>{user?.name || 'Dr. Priya Sundaram'}</strong> • Reg #{user?.registrationNumber || 'NGO-IND-TN-4092'} • Base: <strong>T. Nagar Central Hub</strong>
              </p>
            </div>
          </div>

          {/* 4 Summary Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Active Relief Camps */}
            <Card padding="md" className="bg-white border-slate-200">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Camps</span>
                <div className="p-2 rounded-lg bg-blue-50 text-brand-700">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-navy-900 font-mono">
                {user?.activeCampsCount ?? 3}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Full logistics &amp; triage active</span>
            </Card>

            {/* 2. Incoming Requests */}
            <Card padding="md" className="bg-white border-slate-200">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Incoming Requests</span>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-amber-700 font-mono">
                {openRequests.length + 5}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Requiring NGO supply allocation</span>
            </Card>

            {/* 3. Volunteers Deployed */}
            <Card padding="md" className="bg-white border-slate-200">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Volunteers Deployed</span>
                <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-purple-700 font-mono">
                {onFieldVolunteers.length + 20}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Active on field missions</span>
            </Card>

            {/* 4. Supplies Dispatched */}
            <Card padding="md" className="bg-white border-slate-200">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Supplies Dispatched</span>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-emerald-700 font-mono">
                {user?.suppliesDispatchedCount?.toLocaleString() ?? '14,250'}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Total meals, water &amp; kits delivered</span>
            </Card>
          </div>

          {/* 2-Column: Inventory Health & Incoming Requests */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col: Incoming Emergency Requests (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-600" />
                  Priority Assistance Requests
                </h3>
                <button
                  type="button"
                  onClick={() => navigate('/ngo/requests')}
                  className="text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  View All Requests &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {openRequests.slice(0, 3).map((req) => (
                  <Card
                    key={req.id}
                    hoverable
                    onClick={() => navigate(`/ngo/requests/${req.id}`)}
                    padding="md"
                    className="bg-white border border-slate-200/90 hover:border-brand-500 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-100 text-navy-900 font-mono font-bold text-xs shrink-0">
                        {req.id}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {req.requestTitle}
                          </h4>
                          <StatusBadge
                            variant={getSeverityBadgeVariant(req.urgency)}
                            label={req.urgency.toUpperCase()}
                            size="sm"
                          />
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                          {req.location} • Requester: <strong>{req.victimName}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/ngo/requests/${req.id}`)}
                      >
                        Review &amp; Fulfill
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Col: Supply Stock Quick Overview (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Package className="w-4 h-4 text-sky-600" />
                  Supply Stock Health
                </h3>
                <button
                  type="button"
                  onClick={() => navigate('/ngo/inventory')}
                  className="text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors cursor-pointer"
                >
                  Manage &rarr;
                </button>
              </div>

              <Card padding="md" className="bg-white border-slate-200 space-y-3.5">
                {inventory.slice(0, 4).map((item) => {
                  const isCritical = item.status === 'Critical';
                  const isLow = item.status === 'Low Stock';
                  return (
                    <div key={item.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block truncate max-w-[150px]">{item.name}</span>
                        <span className="text-[10px] text-slate-400">{item.campLocation}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black font-mono text-navy-900 block">{item.quantity.toLocaleString()} {item.unit}</span>
                        <span className={`text-[10px] font-bold ${isCritical ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {lowStockItems.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{lowStockItems.length} items below minimum safety threshold.</span>
                  </div>
                )}
              </Card>
            </div>

          </div>

          {/* Volunteer Field Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                Active Volunteer Field Teams
              </h3>
              <button
                type="button"
                onClick={() => navigate('/ngo/volunteers')}
                className="text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors cursor-pointer"
              >
                Volunteer Roster &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ngoVolunteers.slice(0, 3).map((v) => (
                <Card key={v.id} padding="md" className="bg-white border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">{v.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {v.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{v.name}</h4>
                  <p className="text-xs text-brand-700 font-semibold mt-0.5">{v.role}</p>
                  <p className="text-xs text-slate-500 mt-1">📍 {v.assignedCamp}</p>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Task: <strong>{v.currentTask}</strong></span>
                    <span className="font-mono text-slate-400">{v.hoursActive}h active</span>
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
