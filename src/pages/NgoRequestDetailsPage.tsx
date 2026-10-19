import React from 'react';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import { NgoSidebar } from '../components/layout/NgoSidebar';
import { NgoMobileNav } from '../components/layout/NgoMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Users,
  CheckCircle2,
  Truck,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const NgoRequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { requests, fulfillRequest, dispatchConsignment, deployVolunteers, openSosModal, showToast } = useAuth();
  const navigate = useNavigate();

  const request = requests.find((r) => r.id === id) || requests[0];
  if (!request) return <Navigate to="/ngo/requests" replace />;

  const handleDispatchConsignment = () => {
    dispatchConsignment(request.id);
  };

  const handleDeployVolunteers = () => {
    deployVolunteers(request.id);
  };

  const handleMarkFulfilled = async () => {
    const ok = await fulfillRequest(request.id, 'Rations, clean drinking water and first aid delivered by Red Cross Relief Unit.');
    if (ok) navigate('/ngo/requests');
  };

  const handleContactCitizen = () => {
    showToast(`Connecting direct call to citizen ${request.victimName} (${request.phone})...`);
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
      <NgoMobileNav />
      <NgoSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/ngo/requests"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                  Ticket Review &amp; Allocation
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-mono font-bold text-navy-900">{request.id}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                {request.requestTitle}
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
            
            {/* Header Status Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black font-mono text-navy-900">
                    {request.id}
                  </span>
                  <StatusBadge
                    variant={getSeverityBadgeVariant(request.urgency)}
                    label={`${request.urgency.toUpperCase()} URGENCY`}
                    size="md"
                  />
                  <StatusBadge
                    variant={request.status === 'Resolved' ? 'resolved' : 'warning'}
                    label={request.status.toUpperCase()}
                    size="md"
                  />
                </div>
                <p className="text-sm font-bold text-slate-700 mt-1">
                  Citizen Request: <span className="text-navy-900">{request.requestTitle}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${request.phone}`}
                  onClick={handleContactCitizen}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  CONTACT CITIZEN
                </a>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Requester Name</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1 mt-1 text-sm">
                  {request.victimName}
                </span>
                <span className="text-slate-500 font-mono">{request.phone}</span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Location / Sector</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  {request.location}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block">People In Distress</span>
                <span className="font-bold text-slate-900 flex items-center gap-1 mt-1">
                  <Users className="w-3.5 h-3.5 text-brand-600" />
                  {request.peopleCount || 4} Family Members
                </span>
              </div>
            </div>

            {/* Situation Details */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-950 space-y-1">
              <span className="font-bold block">Incident Description &amp; Access Notes:</span>
              <p className="leading-relaxed text-sm text-blue-900">
                {request.details || 'Stranded on elevated floor due to floodwaters. Food rations and fresh drinking water packs required.'}
              </p>
            </div>

            {/* Required NGO Supply Consignment Allocation */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Estimated NGO Supply Package:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                  <span className="text-slate-500 block">Food Rations</span>
                  <span className="font-bold text-navy-900">4 Packs</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                  <span className="text-slate-500 block">Water (1L)</span>
                  <span className="font-bold text-navy-900">8 Bottles</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                  <span className="text-slate-500 block">First Aid Kit</span>
                  <span className="font-bold text-navy-900">1 Kit</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                  <span className="text-slate-500 block">Blankets</span>
                  <span className="font-bold text-navy-900">2 Units</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              {request.status !== 'Resolved' ? (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    onClick={handleDeployVolunteers}
                    leftIcon={<UserCheck className="w-4 h-4 text-purple-600" />}
                  >
                    DEPLOY VOLUNTEERS
                  </Button>

                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleDispatchConsignment}
                    leftIcon={<Truck className="w-4 h-4" />}
                    className="bg-brand-700 hover:bg-brand-800"
                  >
                    DISPATCH CONSIGNMENT
                  </Button>

                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleMarkFulfilled}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    MARK AS FULFILLED
                  </Button>
                </>
              ) : (
                <div className="w-full p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center flex items-center justify-center gap-2 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Assistance Request Completed &amp; Documented by Red Cross Disaster Relief.
                </div>
              )}
            </div>

          </Card>
        </div>
      </main>
    </div>
  );
};
