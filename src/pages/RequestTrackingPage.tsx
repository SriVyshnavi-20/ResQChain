import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileNav } from '../components/layout/MobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  PhoneCall,
  XCircle,
  MapPin,
  UserCheck,
  CheckCircle2,
  Radio
} from 'lucide-react';

export const RequestTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { requests, cancelRequest, openSosModal, showToast } = useAuth();

  const request = requests.find((r) => r.id === id) || requests[0];
  if (!request) return <Navigate to="/victim/my-requests" replace />;

  const handleCancel = () => {
    if (request.status === 'Cancelled' || request.status === 'Resolved') {
      showToast('This request is already finalized.');
      return;
    }
    cancelRequest(request.id);
  };

  const handleCallResponder = () => {
    showToast(`Connecting to responder ${request.assignedTo || 'Dispatch Unit'}...`);
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
          <div className="flex items-center gap-3">
            <Link
              to="/victim/my-requests"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                  Live Ticket Tracking
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
          
          {/* Main Info Card */}
          <Card padding="lg" className="bg-white border-slate-200 shadow-sm space-y-6">
            
            {/* Status & ID Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black font-mono text-navy-900">
                    {request.id}
                  </span>
                  <StatusBadge
                    variant={getStatusBadgeVariant(request.status)}
                    label={request.status.toUpperCase()}
                    size="md"
                  />
                </div>
                <p className="text-sm font-bold text-slate-700 mt-1">
                  Request: <span className="text-slate-900">{request.requestTitle}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {request.assignedResponderPhone ? (
                  <a
                    href={`tel:${request.assignedResponderPhone}`}
                    onClick={handleCallResponder}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <PhoneCall className="w-4 h-4" />
                    CALL RESPONDER
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={handleCallResponder}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    CALL DISPATCH
                  </button>
                )}

                {request.status !== 'Cancelled' && request.status !== 'Resolved' && (
                  <Button
                    variant="outline"
                    size="md"
                    leftIcon={<XCircle className="w-4 h-4 text-red-500" />}
                    onClick={handleCancel}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    CANCEL REQUEST
                  </Button>
                )}
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Location</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  {request.location}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Severity</span>
                <span className="font-bold text-slate-900 mt-1 block">
                  {request.urgency} Priority
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Assigned Responder</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-1">
                  <UserCheck className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  {request.assignedTo || 'Unassigned'}
                </span>
              </div>
            </div>

            {/* Description note if any */}
            {request.details && (
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-700 block mb-1">Situation Report:</span>
                <p className="leading-relaxed">{request.details}</p>
              </div>
            )}

            {/* Vertical Progress Timeline */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-6 flex items-center gap-2">
                <Radio className="w-4 h-4 text-brand-600" />
                Live Response Progress Timeline
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3.5 sm:before:left-4.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {request.timeline.map((step, index) => {
                  const isCompleted = step.completed;
                  const isCurrent = step.current;

                  return (
                    <div key={index} className="relative flex items-start gap-4">
                      {/* Node Icon */}
                      <div
                        className={`absolute -left-6 sm:-left-8 w-7 h-7 rounded-full flex items-center justify-center border-2 bg-white transition-all ${
                          isCompleted
                            ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                            : isCurrent
                            ? 'border-brand-600 text-brand-600 ring-4 ring-brand-100 animate-pulse'
                            : 'border-slate-300 text-slate-300'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isCurrent ? (
                          <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-slate-300" />
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-sm font-bold ${isCurrent ? 'text-brand-900' : isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>
                            {step.title}
                          </h4>
                          {step.time && (
                            <span className="text-[11px] font-mono text-slate-500">
                              {step.time}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          {step.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </Card>
        </div>
      </main>
    </div>
  );
};
