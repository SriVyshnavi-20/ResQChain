import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Menu, X, PhoneCall, LogIn, LayoutDashboard } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openSosModal, user } = useAuth();
  const location = useLocation();

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-white shadow-md shadow-navy-900/20 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6 text-sos-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-navy-900 font-sans">
                  RESQ<span className="text-sos-600">CHAIN</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold -mt-1">
                  Disaster Response
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                isCurrent('/')
                  ? 'text-navy-900 bg-slate-100 font-semibold'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <a
              href="#services"
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-navy-900 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Services
            </a>
            <a
              href="#about"
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-navy-900 hover:bg-slate-50 rounded-lg transition-colors"
            >
              About
            </a>
            <a
              href="#helplines"
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-navy-900 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-navy-600" />
              Helplines
            </a>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="sos"
              size="sm"
              leftIcon={<ShieldAlert className="w-4 h-4 animate-pulse" />}
              onClick={openSosModal}
              className="font-bold tracking-wide"
            >
              EMERGENCY SOS
            </Button>

            {user ? (
              <Link
                to={
                  user.role === 'Volunteer'
                    ? '/volunteer/dashboard'
                    : user.role === 'NGO'
                    ? '/ngo/dashboard'
                    : user.role === 'Government Official'
                    ? '/government/dashboard'
                    : '/victim/dashboard'
                }
              >
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<LayoutDashboard className="w-4 h-4 text-navy-800" />}
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<LogIn className="w-4 h-4" />}
                >
                  Login / Sign Up
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="sos"
              size="sm"
              onClick={openSosModal}
              className="text-xs px-2.5 py-1.5 font-bold"
            >
              SOS
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isCurrent('/') ? 'bg-slate-100 text-navy-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </Link>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Services
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            About
          </a>
          <a
            href="#helplines"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Emergency Helplines
          </a>
          <div className="pt-4 space-y-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full"
            >
              <Button variant="primary" size="md" fullWidth leftIcon={<LogIn className="w-4 h-4" />}>
                Login / Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
