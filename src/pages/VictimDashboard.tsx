import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  Home,
  FileText,
  BookOpen,
  PhoneCall,
  Package,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Info,
  Radio,
  LifeBuoy
} from 'lucide-react';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileNav } from '../components/layout/MobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';

export const VictimDashboard: React.FC = () => {
  const { user, openSosModal, requests, announcements } = useAuth();
  const navigate = useNavigate();
  const [safetyTipsModalOpen, setSafetyTipsModalOpen] = useState(false);

  const resolvedCount = requests.filter(r => r.status === 'Resolved').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Mobile Navigation Header */}
      <MobileNav />

      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                Victim Portal
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                {user?.location || 'Chennai, Tamil Nadu'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Victim Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="sos"
              size="sm"
              leftIcon={<ShieldAlert className="w-4 h-4 animate-pulse" />}
              onClick={openSosModal}
              className="shadow-sm font-bold"
            >
              EMERGENCY SOS
            </Button>
          </div>
        </header>

        {/* Dashboard Main Content Body */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* ================= GREETING BANNER ================= */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 text-white shadow-md border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden sm:block">
              <ShieldAlert className="w-48 h-48 text-white" />
            </div>

            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                GPS Signal Active • Emergency Dispatch Available
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Hello, {user?.name || 'Anvitha'}!
              </h2>

              <p className="text-base text-slate-300">
                How can we help you today?
              </p>

              <p className="text-xs sm:text-sm text-slate-400 pt-1 leading-relaxed">
                If you are in immediate peril, please press the red <strong>Emergency SOS</strong> button. You can also report an incident, find nearby shelters, or track your live assistance requests below.
              </p>
            </div>
          </div>

          {/* ================= 4 MAIN ACTION CARDS ================= */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Primary Actions
              </h3>
              <span className="text-xs text-slate-400">Essential Relief Gateways</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* 1. SOS Request */}
              <Card
                hoverable
                onClick={openSosModal}
                padding="md"
                className="bg-white border-2 border-red-200 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/10 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ShieldAlert className="w-6 h-6 animate-pulse" />
                    </div>
                    <StatusBadge variant="emergency" label="Critical" size="sm" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                    1. SOS Request
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Request immediate emergency help
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-600">
                  <span>Send SOS Alert</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>

              {/* 2. Nearby Shelters */}
              <Card
                hoverable
                onClick={() => navigate('/victim/shelters')}
                padding="md"
                className="bg-white border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-brand-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Home className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                      19 Open
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                    2. Nearby Shelters
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Find safe shelters near you
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-navy-900">
                  <span>View Safe Shelters</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>

              {/* 3. My Requests */}
              <Card
                hoverable
                onClick={() => navigate('/victim/my-requests')}
                padding="md"
                className="bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                      {requests.length} Active
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    3. My Requests
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Track your assistance requests
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-emerald-800">
                  <span>Track Status</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>

              {/* 4. Safety Tips */}
              <Card
                hoverable
                onClick={() => setSafetyTipsModalOpen(true)}
                padding="md"
                className="bg-white border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
                      Guidelines
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                    4. Safety Tips
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    View important emergency information
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-amber-900">
                  <span>Read Emergency Tips</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </div>
          </section>

          {/* ================= QUICK ACTIONS SECTION ================= */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
              <Radio className="w-4 h-4 text-navy-800" />
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Report Emergency */}
              <button
                type="button"
                onClick={() => navigate('/victim/report-emergency')}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-left transition-colors flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="text-[10px] text-emerald-700 font-semibold">Ready</span>
                </div>
                <div className="mt-3">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-navy-900 block">
                    Report Emergency
                  </span>
                  <span className="text-[11px] text-slate-500">Log hazard / incident</span>
                </div>
              </button>

              {/* Find Shelter */}
              <button
                type="button"
                onClick={() => navigate('/victim/shelters')}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-left transition-colors flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <Home className="w-5 h-5 text-brand-600" />
                  <span className="text-[10px] text-emerald-700 font-semibold">19 Open</span>
                </div>
                <div className="mt-3">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-navy-900 block">
                    Find Shelter
                  </span>
                  <span className="text-[11px] text-slate-500">Safe relief camps</span>
                </div>
              </button>

              {/* Request Supplies */}
              <button
                type="button"
                onClick={() => navigate('/victim/report-emergency')}
                className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-left transition-colors flex flex-col justify-between group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <Package className="w-5 h-5 text-sky-600" />
                  <span className="text-[10px] text-emerald-700 font-semibold">Instant</span>
                </div>
                <div className="mt-3">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-navy-900 block">
                    Request Supplies
                  </span>
                  <span className="text-[11px] text-slate-500">Food, water, medicines</span>
                </div>
              </button>

              {/* Call Helpline */}
              <a
                href="tel:112"
                className="p-3.5 rounded-lg border border-red-200 bg-red-50/60 hover:bg-red-100/70 text-left transition-colors flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between w-full">
                  <PhoneCall className="w-5 h-5 text-red-600" />
                  <span className="text-[10px] text-red-700 font-bold">24x7 Direct</span>
                </div>
                <div className="mt-3">
                  <span className="text-xs font-bold text-red-950 group-hover:text-red-700 block">
                    Call Helpline
                  </span>
                  <span className="text-[11px] text-red-700 font-semibold">Toll-Free 112 / 1078</span>
                </div>
              </a>
            </div>
          </section>

          {/* ================= 2-COLUMN SECTION: ANNOUNCEMENTS & STATISTICS ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col: Recent Announcements */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  Recent Announcements
                </h3>
                <Link
                  to="/victim/announcements"
                  className="text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors flex items-center gap-1"
                >
                  View All &rarr;
                </Link>
              </div>

              <div className="space-y-3">
                {announcements.map((ann) => {
                  const isEmergency = ann.type === 'emergency';
                  const isWarning = ann.type === 'warning';

                  const bgStyle = isEmergency
                    ? 'bg-red-50/80 border-red-200 text-red-950'
                    : isWarning
                    ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                    : 'bg-sky-50/70 border-sky-200 text-sky-950';

                  const iconBoxStyle = isEmergency
                    ? 'bg-red-200/70 text-red-800'
                    : isWarning
                    ? 'bg-amber-200/70 text-amber-800'
                    : 'bg-sky-200/70 text-sky-800';

                  return (
                    <div
                      key={ann.id}
                      onClick={() => navigate('/victim/announcements')}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:shadow-xs transition-shadow ${bgStyle}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${iconBoxStyle}`}>
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
                            <h4
                              className={`text-sm font-bold ${
                                isEmergency ? 'text-red-900' : isWarning ? 'text-amber-900' : 'text-sky-900'
                              }`}
                            >
                              {ann.title}
                            </h4>
                            <StatusBadge
                              variant={ann.type}
                              label={isEmergency ? 'Emergency' : isWarning ? 'Warning' : 'Information'}
                              size="sm"
                            />
                          </div>
                          <p
                            className={`text-xs mt-1 leading-relaxed ${
                              isEmergency
                                ? 'text-red-900/90'
                                : isWarning
                                ? 'text-amber-900/90'
                                : 'text-sky-900/90'
                            }`}
                          >
                            {ann.message}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`text-[11px] font-medium sm:text-right shrink-0 ${
                          isEmergency ? 'text-red-700' : isWarning ? 'text-amber-700' : 'text-sky-700'
                        }`}
                      >
                        {ann.timestamp} {ann.zone ? `• ${ann.zone}` : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Col: Victim Statistics Section */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                My Overview
              </h3>

              <Card padding="md" className="space-y-4 bg-white">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Activity Summary</span>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active Profile
                  </span>
                </div>

                {/* Stat 1: My Requests */}
                <div
                  onClick={() => navigate('/victim/my-requests')}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-blue-100 text-brand-700">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">My Requests</span>
                      <span className="text-[10px] text-slate-400">Total submitted tickets</span>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-navy-900 font-mono">
                    {requests.length}
                  </span>
                </div>

                {/* Stat 2: Resolved */}
                <div
                  onClick={() => navigate('/victim/my-requests')}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">Resolved</span>
                      <span className="text-[10px] text-slate-400">Fulfillment completed</span>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-emerald-700 font-mono">
                    {resolvedCount}
                  </span>
                </div>

                {/* Stat 3: People Helped */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                      <LifeBuoy className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">People Helped</span>
                      <span className="text-[10px] text-slate-400">Family members sheltered</span>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-amber-800 font-mono">
                    2
                  </span>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/victim/my-requests')}
                    className="text-xs font-semibold text-brand-700 hover:text-brand-900 transition-colors cursor-pointer"
                  >
                    View Complete Request Log &rarr;
                  </button>
                </div>
              </Card>
            </div>
          </div>

        </div>
      </main>

      {/* Safety Tips Modal */}
      <Modal
        isOpen={safetyTipsModalOpen}
        onClose={() => setSafetyTipsModalOpen(false)}
        title="Emergency Safety & Preparedness Tips"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
            <h4 className="font-bold flex items-center gap-1.5 text-sm text-amber-950 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Flood & Heavy Rain Survival Guide
            </h4>
            <ul className="list-disc pl-4 space-y-1 mt-1 text-xs">
              <li>Immediately disconnect the main electrical power grid switch if water enters the premises.</li>
              <li>Store potable water in sealed containers and boil drinking water before consumption.</li>
              <li>Do not attempt to wade, swim, or drive through moving flood water.</li>
              <li>Keep an emergency go-bag ready with identification documents, phone power banks, and essential medications.</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900">
            <h4 className="font-bold flex items-center gap-1.5 text-sm text-sky-950 mb-1">
              <PhoneCall className="w-4 h-4 text-sky-700" />
              Emergency Communication Protocols
            </h4>
            <ul className="list-disc pl-4 space-y-1 mt-1 text-xs">
              <li>Conserve smartphone battery by activating Ultra Power Saving mode.</li>
              <li>Use SMS or text-based SOS when mobile cellular towers have congested voice channels.</li>
              <li>Follow verified updates through ResQChain announcements or local district collectorate feeds.</li>
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => setSafetyTipsModalOpen(false)}
            >
              Got It
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
