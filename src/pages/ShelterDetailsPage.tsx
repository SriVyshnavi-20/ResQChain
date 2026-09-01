import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileNav } from '../components/layout/MobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  ShieldCheck,
  Home
} from 'lucide-react';

export const ShelterDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { shelters, requestShelter, openSosModal, showToast } = useAuth();

  const shelter = shelters.find((s) => s.id === id) || shelters[0];

  const handleDirections = () => {
    showToast(`Navigating to ${shelter.name}: Routing via flood-safe elevated corridor.`);
  };

  const handleRequestShelter = () => {
    requestShelter(shelter.id);
  };

  const handleContact = () => {
    showToast(`Calling shelter front desk at ${shelter.contactPhone}...`);
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
              to="/victim/shelters"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                  Shelter Specification
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">{shelter.zone}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                {shelter.name}
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
            
            {/* Shelter Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    {shelter.name}
                  </h2>
                  <StatusBadge variant="resolved" label="Verified Active" size="sm" />
                </div>
                <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  <strong>Location:</strong> {shelter.address}
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center shrink-0">
                <span className="text-[10px] font-bold uppercase text-brand-700 block">Distance</span>
                <span className="text-xl font-mono font-bold text-navy-900">{shelter.distanceKm} km</span>
              </div>
            </div>

            {/* Capacity Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Capacity</span>
                <span className="text-3xl font-extrabold text-navy-900 font-mono mt-1 block">
                  {shelter.capacity}
                </span>
                <span className="text-xs text-slate-400">Total verified bed spaces</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">Available Spaces</span>
                <span className="text-3xl font-extrabold text-emerald-700 font-mono mt-1 block">
                  {shelter.availableSpaces}
                </span>
                <span className="text-xs text-emerald-600 font-medium">Ready for immediate intake</span>
              </div>
            </div>

            {/* Resources Checklist */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Available Resources
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Food', 'Water', 'Medical', 'Clothing'].map((res) => {
                  const isAvailable = shelter.resources.includes(res as any);
                  return (
                    <div
                      key={res}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                        isAvailable
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${isAvailable ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span className="text-sm">✓ {res}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Amenities & Security notice */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Shelter Facilities &amp; Protocols:
              </span>
              <p>• 24x7 Power backup generators, drinking water filtration, and pediatric medical support on site.</p>
              <p>• Dedicated female and family quarters with on-duty government security personnel.</p>
            </div>

            {/* 3 Main Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleDirections}
                leftIcon={<Navigation className="w-4 h-4 text-navy-800" />}
              >
                GET DIRECTIONS
              </Button>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleRequestShelter}
                leftIcon={<Home className="w-4 h-4" />}
              >
                REQUEST SHELTER
              </Button>

              <a
                href={`tel:${shelter.contactPhone}`}
                onClick={handleContact}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base transition-colors border border-slate-300 shadow-xs"
              >
                <Phone className="w-4 h-4 text-slate-600" />
                CONTACT SHELTER
              </a>
            </div>

          </Card>
        </div>
      </main>
    </div>
  );
};
