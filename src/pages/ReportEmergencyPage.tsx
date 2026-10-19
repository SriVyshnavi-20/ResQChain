import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileNav } from '../components/layout/MobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { getPosition, formatCoords, Coords } from '../lib/geo';
import {
  MapPin,
  Compass,
  Flame,
  Activity,
  Wind,
  Mountain,
  HelpCircle,
  HeartPulse,
  Home,
  Droplets,
  Utensils,
  Send,
  ShieldAlert
} from 'lucide-react';

export const ReportEmergencyPage: React.FC = () => {
  const { user, addEmergencyRequest, openSosModal, showToast } = useAuth();
  const navigate = useNavigate();

  const [location, setLocation] = useState(user?.location || 'Chennai, Tamil Nadu');
  const [disasterType, setDisasterType] = useState<'Flood' | 'Fire' | 'Earthquake' | 'Cyclone' | 'Landslide' | 'Other'>('Flood');
  const [needType, setNeedType] = useState<'Medical' | 'Shelter' | 'Food & Water' | 'Supplies' | 'Rescue'>('Food & Water');
  const [urgency, setUrgency] = useState<'Low' | 'Moderate' | 'Critical'>('Critical');
  const [details, setDetails] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const disasterOptions = [
    { label: 'Flood', icon: Droplets },
    { label: 'Fire', icon: Flame },
    { label: 'Earthquake', icon: Activity },
    { label: 'Cyclone', icon: Wind },
    { label: 'Landslide', icon: Mountain },
    { label: 'Other', icon: HelpCircle }
  ] as const;

  const needOptions = [
    { label: 'Medical', icon: HeartPulse },
    { label: 'Shelter', icon: Home },
    { label: 'Food', icon: Utensils },
    { label: 'Water', icon: Droplets }
  ] as const;

  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    const pos = await getPosition();
    setIsLocating(false);
    if (!pos) {
      showToast('Unable to read your GPS location. Allow location access or type your address.');
      return;
    }
    setCoords(pos);
    setLocation(`${formatCoords(pos)} (GPS Locked)`);
    showToast(`GPS coordinates locked: ${formatCoords(pos)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      showToast('Please provide a brief description of the situation.');
      return;
    }

    setIsSubmitting(true);
    const newId = await addEmergencyRequest({
      disasterType,
      category: needType,
      urgency: urgency === 'Moderate' ? 'High' : urgency,
      location,
      details,
      coordinates: coords
    });
    setIsSubmitting(false);

    if (newId) navigate(`/victim/request/${newId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <MobileNav />
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                Public Disaster Ledger
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Victim: {user?.name || 'Anvitha Shetty'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              REPORT AN EMERGENCY
            </h1>
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

        {/* Form Body */}
        <div className="p-4 sm:p-8 max-w-4xl w-full mx-auto space-y-6">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-blue-950 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-sm font-bold block">Public Emergency Registration</span>
              <p className="text-xs text-blue-900/90 mt-0.5">
                This request is timestamped and logged on the public ledger.
              </p>
            </div>
          </div>

          <Card padding="lg" className="bg-white border-slate-200/90 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. Location Section */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Current Location
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="flex-1">
                    <Input
                      required
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setCoords(null);
                      }}
                      placeholder="Enter address, zone, or landmark"
                      leftIcon={<MapPin className="w-4 h-4 text-red-500" />}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    leftIcon={<Compass className={`w-4 h-4 text-navy-800 ${isLocating ? 'animate-spin' : ''}`} />}
                    onClick={handleUseCurrentLocation}
                    className="shrink-0"
                  >
                    {isLocating ? 'Locating...' : 'Use Current Location'}
                  </Button>
                </div>
              </div>

              {/* 2. Disaster Type Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Disaster Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {disasterOptions.map((item) => {
                    const isSelected = disasterType === item.label;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setDisasterType(item.label)}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-navy-900 text-white border-navy-900 shadow-sm ring-1 ring-navy-800'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-brand-300' : 'text-slate-500'}`} />
                        <span className="text-xs font-semibold">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Type of Need Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Type of Need
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {needOptions.map((item) => {
                    const isSelected = needType.includes(item.label);
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setNeedType(item.label as any)}
                        className={`p-3.5 rounded-xl border text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-navy-900 text-white border-navy-900 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-300' : 'text-slate-500'}`} />
                        <span className="text-xs font-semibold">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Urgency Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Urgency Level
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['Low', 'Moderate', 'Critical'] as const).map((urg) => {
                    const isSelected = urgency === urg;
                    const styleMap = {
                      Low: isSelected ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-50 text-slate-700 border-slate-200',
                      Moderate: isSelected ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-50 text-slate-700 border-slate-200',
                      Critical: isSelected ? 'bg-red-600 text-white border-red-600 animate-pulse-subtle' : 'bg-slate-50 text-slate-700 border-slate-200'
                    };

                    return (
                      <button
                        key={urg}
                        type="button"
                        onClick={() => setUrgency(urg)}
                        className={`p-3 rounded-xl border font-bold text-xs text-center transition-all cursor-pointer ${styleMap[urg]}`}
                      >
                        {urg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Description Textarea */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Situation Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe the situation in detail: number of individuals, hazards, floor/access notes, medical conditions..."
                  className="w-full p-3.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-800 bg-white placeholder:text-slate-400"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-400">
                  Dispatched immediately to local disaster management cell.
                </span>

                <Button
                  type="submit"
                  variant="sos"
                  size="lg"
                  disabled={isSubmitting}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  SUBMIT REQUEST
                </Button>
              </div>

            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};
