import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  AlertOctagon,
  Home,
  Bell,
  User,
  Settings,
  ShieldAlert,
  LogOut,
  MapPin,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const VolunteerSidebar: React.FC = () => {
  const { user, logout, openSosModal, assignments } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isCurrent = (path: string) => location.pathname === path;

  const activeAssignmentsCount = assignments.filter(
    (a) => a.status === 'Accepted' || a.status === 'Enroute'
  ).length;

  const pendingRequestsCount = assignments.filter(
    (a) => a.status === 'Pending'
  ).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-200 min-h-screen border-r border-slate-800 shrink-0">
      {/* Top Branding */}
      <div className="p-6 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sos-600 flex items-center justify-center text-white shadow-md shadow-sos-600/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white">
              RESQ<span className="text-sos-500">CHAIN</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Volunteer Portal
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
          Volunteer Operations
        </div>

        {/* Dashboard */}
        <Link
          to="/volunteer/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/volunteer/dashboard')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-brand-400" />
          <span>Dashboard</span>
        </Link>

        {/* Assignments */}
        <Link
          to="/volunteer/assignments"
          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/volunteer/assignments') || location.pathname.startsWith('/volunteer/assignments/')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <ClipboardList className="w-4 h-4 text-emerald-400" />
            <span>Assignments</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-bold border border-emerald-800">
            {activeAssignmentsCount}
          </span>
        </Link>

        {/* Requests */}
        <Link
          to="/volunteer/requests"
          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/volunteer/requests')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            <span>Requests</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-mono font-bold border border-amber-800">
            {pendingRequestsCount}
          </span>
        </Link>

        {/* Shelters */}
        <Link
          to="/volunteer/shelters"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/volunteer/shelters')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Home className="w-4 h-4 text-blue-400" />
          <span>Shelters</span>
        </Link>

        {/* Announcements */}
        <Link
          to="/volunteer/announcements"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/volunteer/announcements')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Bell className="w-4 h-4 text-red-400" />
          <span>Announcements</span>
        </Link>

        <div className="pt-4 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Account
        </div>

        {/* Profile */}
        <Link
          to="/volunteer/profile"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/volunteer/profile')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4 text-slate-400" />
          <span>Profile</span>
        </Link>

        {/* Settings */}
        <Link
          to="/volunteer/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/volunteer/settings')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </Link>
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm border border-emerald-600">
            {user?.name ? user.name[0] : 'P'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">
              {user?.name || 'Priya Nair'} (Volunteer)
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">{user?.zone || 'Lakeview Zone'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 px-1 pb-3">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>Shift: {user?.shift || '9:00 AM - 5:00 PM'}</span>
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
