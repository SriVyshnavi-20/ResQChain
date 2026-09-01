import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  Home,
  Bell,
  User,
  Settings,
  ShieldAlert,
  LogOut,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, logout, openSosModal, requests } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isCurrent = (path: string) => location.pathname === path;

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
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Victim Portal
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
          Navigation
        </div>

        {/* Dashboard */}
        <Link
          to="/victim/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/victim/dashboard')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-brand-400" />
          <span>Dashboard</span>
        </Link>

        {/* My Requests */}
        <Link
          to="/victim/my-requests"
          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/victim/my-requests') || location.pathname.startsWith('/victim/request/')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>My Requests</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-bold border border-emerald-800">
            {requests.length}
          </span>
        </Link>

        {/* Report Emergency */}
        <Link
          to="/victim/report-emergency"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/victim/report-emergency')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Report Emergency</span>
        </Link>

        {/* Nearby Shelters */}
        <Link
          to="/victim/shelters"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/victim/shelters') || location.pathname.startsWith('/victim/shelter/')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Home className="w-4 h-4 text-blue-400" />
          <span>Nearby Shelters</span>
        </Link>

        {/* Announcements */}
        <Link
          to="/victim/announcements"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/victim/announcements')
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
          to="/victim/profile"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/victim/profile')
              ? 'bg-navy-800 text-white border border-slate-700 shadow-sm font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4 text-slate-400" />
          <span>Profile</span>
        </Link>

        {/* Settings */}
        <Link
          to="/victim/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isCurrent('/victim/settings')
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
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-navy-700 text-white flex items-center justify-center font-bold text-sm border border-slate-700">
            {user?.name ? user.name[0] : 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">
              {user?.name || 'Anvitha Shetty'}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-400 shrink-0" />
              <span className="truncate">{user?.location || 'Chennai, TN'}</span>
            </div>
          </div>
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
