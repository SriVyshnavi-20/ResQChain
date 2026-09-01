import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  FileText,
  Users,
  Home,
  Bell,
  BarChart3,
  Building2,
  Settings,
  ShieldAlert,
  LogOut,
  MapPin,
  AlertOctagon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const GovSidebar: React.FC = () => {
  const { user, logout, openSosModal, disasterZones, requests } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isCurrent = (path: string) => location.pathname === path;
  const activeCrisesCount = disasterZones.filter(z => z.status === 'Active Crisis').length;
  const criticalRequestsCount = requests.filter(r => r.urgency === 'Critical' && r.status !== 'Resolved').length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-950 text-slate-200 min-h-screen border-r border-slate-800 shrink-0">
      {/* Top Branding */}
      <div className="p-6 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-600/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white">
              RESQ<span className="text-amber-500">CHAIN</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              State Disaster Command
            </span>
          </div>
        </Link>
      </div>

      {/* Prominent Red SOS Button */}
      <div className="p-4 border-b border-slate-800/80">
        <button
          type="button"
          onClick={openSosModal}
          className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-600/30 hover:from-red-500 hover:to-red-600 active:scale-[0.98] transition-all cursor-pointer ring-2 ring-red-500/30"
        >
          <ShieldAlert className="w-5 h-5 animate-pulse" />
          EMERGENCY SOS
        </button>
      </div>

      {/* Navigation items */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Executive Incident Command
        </div>

        {/* Dashboard */}
        <Link
          to="/government/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/government/dashboard')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-amber-400" />
          <span>Government Dashboard</span>
        </Link>

        {/* Disaster Monitoring */}
        <Link
          to="/government/monitoring"
          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/government/monitoring')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <span>Disaster Monitoring</span>
          </div>
          {activeCrisesCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 font-mono font-bold border border-red-800 flex items-center gap-0.5">
              <AlertOctagon className="w-2.5 h-2.5 text-red-400" />
              {activeCrisesCount} Alert
            </span>
          )}
        </Link>

        {/* Emergency Requests */}
        <Link
          to="/government/requests"
          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/government/requests')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Emergency Requests</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-mono font-bold border border-amber-800">
            {criticalRequestsCount} Crit
          </span>
        </Link>

        {/* Response Coordination */}
        <Link
          to="/government/coordination"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/government/coordination')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-purple-400" />
          <span>Response Coordination</span>
        </Link>

        {/* Shelter Management */}
        <Link
          to="/government/shelters"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/government/shelters')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Home className="w-4 h-4 text-blue-400" />
          <span>Shelter Management</span>
        </Link>

        {/* Alerts & Announcements */}
        <Link
          to="/government/alerts"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/government/alerts')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Bell className="w-4 h-4 text-red-400" />
          <span>Alerts &amp; Broadcasts</span>
        </Link>

        {/* Reports & Analytics */}
        <Link
          to="/government/reports"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/government/reports')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-teal-400" />
          <span>Reports &amp; SITREP</span>
        </Link>

        <div className="pt-4 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Executive
        </div>

        {/* Government Profile */}
        <Link
          to="/government/profile"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/government/profile')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4 text-slate-400" />
          <span>Government Profile</span>
        </Link>

        {/* Settings */}
        <Link
          to="/government/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/government/settings')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </Link>
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-sm border border-amber-500">
            {user?.name ? user.name[0] : 'R'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">
              {user?.name || 'R. Rajesh IAS'}
            </div>
            <div className="text-[11px] text-amber-300 truncate">
              {user?.designation || 'Principal Secretary - SDMA'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400 px-1 pb-3">
          <MapPin className="w-3 h-3 text-red-400 shrink-0" />
          <span className="truncate">{user?.location || 'Ezhilagam, Chennai'}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex-1 text-center py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
          >
            Home
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-medium border border-red-900/50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};
