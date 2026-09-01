import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Users,
  Package,
  Home,
  Bell,
  Building2,
  Settings,
  LogOut,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const NgoMobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, openSosModal, requests } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isCurrent = (path: string) => location.pathname === path;
  const openRequestsCount = requests.filter(r => r.status === 'Open' || r.status === 'Matched').length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="lg:hidden sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800">
      <div className="flex items-center justify-between px-4 h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sos-600 flex items-center justify-center text-white">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-white">
            RESQ<span className="text-sos-500">CHAIN</span>
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-900 text-brand-300 font-semibold border border-brand-700">
            NGO
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openSosModal}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            SOS
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="px-4 py-4 space-y-3 bg-slate-900 border-t border-slate-800 shadow-xl">
          {/* User profile strip */}
          <div className="flex items-center gap-3 p-3 bg-slate-800/80 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-sm">
              {user?.name ? user.name[0] : 'P'}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{user?.name || 'Dr. Priya Sundaram'}</div>
              <div className="text-xs text-brand-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-400" /> {user?.organization || 'Red Cross Foundation'}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Link
              to="/ngo/dashboard"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                isCurrent('/ngo/dashboard') ? 'bg-navy-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-brand-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/ngo/requests"
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                isCurrent('/ngo/requests') ? 'bg-navy-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Assistance Requests</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-mono font-bold">
                {openRequestsCount}
              </span>
            </Link>

            <Link
              to="/ngo/volunteers"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                isCurrent('/ngo/volunteers') ? 'bg-navy-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>Volunteer Coordination</span>
            </Link>

            <Link
              to="/ngo/inventory"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                isCurrent('/ngo/inventory') ? 'bg-navy-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Package className="w-4 h-4 text-sky-400" />
              <span>Supplies / Inventory</span>
            </Link>

            <Link
              to="/ngo/shelters"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                isCurrent('/ngo/shelters') ? 'bg-navy-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4 text-blue-400" />
              <span>Shelters</span>
            </Link>

            <Link
              to="/ngo/announcements"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                isCurrent('/ngo/announcements') ? 'bg-navy-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Bell className="w-4 h-4 text-red-400" />
              <span>Announcements</span>
            </Link>

            <Link
              to="/ngo/profile"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                isCurrent('/ngo/profile') ? 'bg-navy-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>NGO Profile</span>
            </Link>

            <Link
              to="/ngo/settings"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                isCurrent('/ngo/settings') ? 'bg-navy-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2 text-center text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 py-2 flex items-center justify-center gap-1.5 text-xs font-medium bg-red-950/70 text-red-300 hover:bg-red-900 rounded-lg"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
