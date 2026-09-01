import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  LogIn,
  AlertTriangle,
  Home,
  HeartPulse,
  Droplets,
  Users,
  PhoneCall,
  Activity,
  CheckCircle2,
  ArrowRight,
  Radio,
  Clock,
  ShieldCheck,
  LifeBuoy
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { MOCK_POPULAR_SERVICES, MOCK_HELPLINES, MOCK_PLATFORM_STATS } from '../data/mockData';

export const LandingPage: React.FC = () => {
  const { openSosModal, showToast } = useAuth();

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'AlertTriangle':
        return <AlertTriangle className="w-6 h-6 text-sos-600" />;
      case 'Home':
        return <Home className="w-6 h-6 text-brand-600" />;
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6 text-rose-600" />;
      case 'Droplets':
        return <Droplets className="w-6 h-6 text-sky-600" />;
      case 'Users':
        return <Users className="w-6 h-6 text-emerald-600" />;
      default:
        return <LifeBuoy className="w-6 h-6 text-slate-600" />;
    }
  };

  const navigate = useNavigate();

  const handleServiceClick = (serviceId: string, title: string) => {
    if (serviceId === 'service-sos') {
      openSosModal();
    } else if (serviceId === 'service-shelter') {
      showToast('Redirecting to emergency shelters directory...');
      navigate('/login');
    } else if (serviceId === 'service-medical' || serviceId === 'service-supplies') {
      showToast(`Redirecting to emergency ${title} portal...`);
      navigate('/login');
    } else if (serviceId === 'service-volunteer') {
      showToast('Redirecting to volunteer rescue response portal...');
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-navy-950 to-slate-900 text-white py-16 sm:py-24 border-b border-slate-800">
          {/* Subtle background grid pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Hero Content */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Emergency Status Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold tracking-wide">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  <Radio className="w-3.5 h-3.5" />
                  LIVE DISASTER RESPONSE NETWORK • STAGE 1
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
                  RESQ<span className="text-sos-500">CHAIN</span>
                </h1>

                <p className="text-xl sm:text-2xl font-medium text-slate-200 max-w-2xl leading-snug">
                  Connecting victims, volunteers &amp; NGOs when it matters most.
                </p>

                <p className="text-base text-slate-400 max-w-xl">
                  Connecting lives, saving lives. ResQChain streamlines critical distress signals, emergency shelter routing, and life-saving volunteer dispatch during natural calamities.
                </p>

                {/* Hero CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <Button
                    variant="sos"
                    size="lg"
                    leftIcon={<ShieldAlert className="w-5 h-5 animate-pulse" />}
                    onClick={openSosModal}
                    className="w-full sm:w-auto shadow-glow-sos"
                  >
                    Emergency SOS
                  </Button>

                  <Link to="/login" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      leftIcon={<LogIn className="w-5 h-5 text-navy-900" />}
                      className="w-full sm:w-auto bg-white text-navy-900 hover:bg-slate-100 border-white"
                    >
                      Login / Sign Up
                    </Button>
                  </Link>
                </div>

                {/* Quick Trust / Info Badges */}
                <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 border-t border-slate-800/80">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Free Public Emergency Utility
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-brand-400" /> Instant 24x7 Beacon Relay
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" /> Verified NDRF &amp; NGO Link
                  </span>
                </div>
              </div>

              {/* Right Column: Emergency & Disaster Visual Card */}
              <div className="lg:col-span-5">
                <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-6 shadow-2xl backdrop-blur-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Live Disaster Radar
                      </span>
                    </div>
                    <StatusBadge variant="emergency" label="Monitored Zone" size="sm" />
                  </div>

                  {/* Active Flood Alert Preview */}
                  <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Flash Flood Alert Active</span>
                      </div>
                      <span className="text-[10px] text-red-300 font-mono">TN-SEC-04</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Heavy rainfall and tidal surge recorded in Riverside Zone. Move to high ground immediately.
                    </p>
                  </div>

                  {/* Mock Interactive Quick SOS Trigger Box */}
                  <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-700/80 text-center space-y-3">
                    <p className="text-xs text-slate-300">
                      Need immediate evacuation or medical attention?
                    </p>
                    <button
                      type="button"
                      onClick={openSosModal}
                      className="w-full py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <ShieldAlert className="w-4 h-4 animate-pulse" />
                      Trigger Distress Beacon
                    </button>
                    <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400">
                      <span>GPS Auto-broadcast</span>
                      <span>•</span>
                      <span>No Sign-in Required</span>
                    </div>
                  </div>

                  {/* Helplines snapshot */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-700/50 flex flex-col">
                      <span className="text-slate-400 text-[10px]">National Emergency</span>
                      <span className="text-white font-bold text-sm">112</span>
                    </div>
                    <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-700/50 flex flex-col">
                      <span className="text-slate-400 text-[10px]">NDRF Helpline</span>
                      <span className="text-white font-bold text-sm">1078</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATISTICS SECTION ================= */}
        <section className="bg-white border-b border-slate-200 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              
              {/* Stat 1 */}
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 transition-all hover:shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-navy-800 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
                  {MOCK_PLATFORM_STATS.peopleHelped}
                </div>
                <div className="text-sm font-semibold text-slate-600 mt-1">
                  People Helped
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Victims rescued and provided relief supplies
                </p>
              </div>

              {/* Stat 2 */}
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 transition-all hover:shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
                  {MOCK_PLATFORM_STATS.requestsResolved}
                </div>
                <div className="text-sm font-semibold text-slate-600 mt-1">
                  Requests Resolved
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Emergency tickets successfully fulfilled
                </p>
              </div>

              {/* Stat 3 */}
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 transition-all hover:shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-3">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
                  {MOCK_PLATFORM_STATS.activeVolunteers}
                </div>
                <div className="text-sm font-semibold text-slate-600 mt-1">
                  Active Volunteers
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  On-field medical and rescue volunteers
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ================= POPULAR SERVICES ================= */}
        <section id="services" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-700 mb-2">
              Emergency Response Network
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Services
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Essential relief channels engineered for rapid access during crises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_POPULAR_SERVICES.map((service) => (
              <Card
                key={service.id}
                hoverable
                padding="lg"
                className="flex flex-col justify-between group border-slate-200/90"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-100 group-hover:bg-slate-200/80 transition-colors">
                      {getServiceIcon(service.iconName)}
                    </div>
                    {service.badge && (
                      <StatusBadge variant="emergency" label={service.badge} size="sm" />
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-navy-900 transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100">
                  <Button
                    variant={service.id === 'service-sos' ? 'sos' : 'outline'}
                    size="sm"
                    fullWidth
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => handleServiceClick(service.id, service.title)}
                  >
                    {service.actionText}
                  </Button>
                </div>
              </Card>
            ))}

            {/* Victim Dashboard Card */}
            <Card
              hoverable
              padding="lg"
              className="flex flex-col justify-between bg-gradient-to-br from-navy-900 to-slate-900 text-white border-navy-800"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-white/10 text-white">
                    <LogIn className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30">
                    Live Portal
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white">
                  Victim Portal &amp; Tracking
                </h4>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  Log in as a citizen to track requests, review safety alerts, and manage emergency coordinates.
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800">
                <Link to="/login" className="block w-full">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    className="bg-white text-navy-900 hover:bg-slate-100 border-none"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Go to Login
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>

        {/* ================= EMERGENCY HELPLINE SECTION ================= */}
        <section id="helplines" className="bg-slate-100/80 border-y border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-red-600 mb-1">
                  24/7 Immediate Assistance
                </h2>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Emergency Helplines &amp; Contacts
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Direct connection with national and regional disaster relief command centers.
                </p>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>All lines are toll-free and functional 24 hours</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOCK_HELPLINES.map((helpline) => (
                <Card
                  key={helpline.number}
                  padding="md"
                  className="bg-white hover:border-slate-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {helpline.type}
                      </span>
                      <PhoneCall className="w-4 h-4 text-navy-700" />
                    </div>
                    <div className="text-2xl font-black text-navy-900 font-mono tracking-tight">
                      {helpline.number}
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mt-1">
                      {helpline.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {helpline.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100">
                    <a
                      href={`tel:${helpline.number}`}
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-navy-900 hover:text-white text-navy-900 text-xs font-bold transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Call Now
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ================= ABOUT PROJECT SECTION ================= */}
        <section id="about" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-100">
                Academic &amp; Humanitarian Project
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                About ResQChain
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                ResQChain is built to tackle communication bottlenecks and resource dispatch delays during natural disasters such as floods, cyclones, and earthquakes. By integrating victim SOS requests, shelter occupancy tracking, and verified volunteer coordination into a single lightweight platform, ResQChain delivers resilient response mechanisms when traditional telecommunications are compromised.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                  <span className="font-bold text-slate-800 block mb-0.5">Victim First</span>
                  <span className="text-slate-500">Fast 1-click distress signaling and safe zone routing.</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                  <span className="font-bold text-slate-800 block mb-0.5">Verified Aid</span>
                  <span className="text-slate-500">Synchronized relief channels for registered NGOs.</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                  <span className="font-bold text-slate-800 block mb-0.5">Disaster Cells</span>
                  <span className="text-slate-500">Real-time alert broadcasts from disaster authorities.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 text-center lg:text-right">
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-800">
                  Ready to test the Victim Portal?
                </h4>
                <p className="text-xs text-slate-500">
                  Sign in with mock credentials to experience the Stage 1 Victim Dashboard.
                </p>
                <Link to="/login" className="block w-full">
                  <Button variant="primary" size="md" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Enter Portal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
