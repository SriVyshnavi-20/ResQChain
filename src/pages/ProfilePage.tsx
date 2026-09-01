import React, { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileNav } from '../components/layout/MobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  MapPin,
  Users,
  HeartHandshake,
  ShieldCheck,
  ShieldAlert,
  Home,
  CheckCircle2,
  Edit3
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, toggleMarkSafe, updateProfile, openSosModal, showToast } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Edit form state
  const [name, setName] = useState(user?.name || 'Anvitha Shetty');
  const [email, setEmail] = useState(user?.email || 'anvi123@org');
  const [location, setLocation] = useState(user?.location || 'Chennai, Tamil Nadu');
  const [familySize, setFamilySize] = useState(user?.familySize || '4 members');
  const [needType, setNeedType] = useState(user?.needType || 'Shelter, Food');

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      location,
      familySize,
      needType
    });
    setEditModalOpen(false);
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
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                Citizen Registry
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Status: {user?.isSafe ? 'Verified Safe' : 'Active In Area'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              MY PROFILE
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

        {/* Content Body */}
        <div className="p-4 sm:p-8 max-w-4xl w-full mx-auto space-y-6">
          
          {/* Safe Status Hero Banner */}
          <div className={`p-6 rounded-2xl border transition-all ${
            user?.isSafe
              ? 'bg-emerald-950 text-white border-emerald-800 shadow-md'
              : 'bg-slate-900 text-white border-slate-800 shadow-sm'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${
                  user?.isSafe ? 'bg-emerald-500 text-white shadow-lg' : 'bg-navy-800 text-white'
                }`}>
                  {user?.isSafe ? <CheckCircle2 className="w-8 h-8" /> : user?.name?.[0] || 'A'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      {user?.name || 'Anvitha Shetty'}
                    </h2>
                    <StatusBadge
                      variant={user?.isSafe ? 'resolved' : 'warning'}
                      label={user?.isSafe ? 'MARKED SAFE' : 'LOCATION MONITORED'}
                      size="sm"
                    />
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {user?.isSafe
                      ? 'Your family is recorded as safe on the NDRF & Disaster Management Registry.'
                      : 'Press "MARK SAFE" once you have reached safety or shelter.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleMarkSafe}
                className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  user?.isSafe
                    ? 'bg-white text-emerald-900 hover:bg-slate-100'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                {user?.isSafe ? 'MARKED AS SAFE ✓' : 'MARK SAFE'}
              </button>
            </div>
          </div>

          {/* Profile Details Card */}
          <Card padding="lg" className="bg-white border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Personal Information &amp; Household
              </h3>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                onClick={() => setEditModalOpen(true)}
              >
                EDIT PROFILE
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-navy-700" /> Full Name
                </span>
                <span className="text-base font-bold text-slate-900">
                  {user?.name || 'Anvitha Shetty'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5 text-navy-700" /> Email Address
                </span>
                <span className="text-base font-mono font-semibold text-slate-900">
                  {user?.email || 'anvi123@org'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" /> Current Location
                </span>
                <span className="text-base font-bold text-slate-900">
                  {user?.location || 'Chennai, Tamil Nadu'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Users className="w-3.5 h-3.5 text-navy-700" /> Family Size
                </span>
                <span className="text-base font-bold text-slate-900">
                  {user?.familySize || '4 members'}
                </span>
              </div>

              <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <HeartHandshake className="w-3.5 h-3.5 text-brand-700" /> Primary Need Type
                </span>
                <span className="text-base font-bold text-slate-900">
                  {user?.needType || 'Shelter, Food'}
                </span>
              </div>
            </div>

            {/* Nearest Relief Camp Card */}
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-brand-600 text-white shadow-sm">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
                    Nearest Relief Camp
                  </span>
                  <h4 className="text-lg font-extrabold text-navy-900 mt-0.5">
                    {user?.nearestShelter || 'Anna Nagar Shelter'}
                  </h4>
                  <p className="text-xs text-slate-600">
                    Distance: <strong>{user?.nearestShelterDistance || '1.2 km'}</strong> • Water, Food &amp; Medical available
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => showToast('Navigating to Anna Nagar Shelter...')}
              >
                View Directions
              </Button>
            </div>

            {/* Bottom 3 Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => setEditModalOpen(true)}
                leftIcon={<Edit3 className="w-4 h-4" />}
              >
                EDIT PROFILE
              </Button>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={toggleMarkSafe}
                className={user?.isSafe ? 'bg-emerald-700 hover:bg-emerald-800' : ''}
                leftIcon={<ShieldCheck className="w-4 h-4" />}
              >
                {user?.isSafe ? 'I AM SAFE ✓' : 'MARK SAFE'}
              </Button>

              <Button
                variant="sos"
                size="lg"
                fullWidth
                onClick={openSosModal}
                leftIcon={<ShieldAlert className="w-4 h-4 animate-pulse" />}
              >
                SEND SOS
              </Button>
            </div>

          </Card>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profile Information"
        maxWidth="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Location"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <Input
            label="Family Size"
            required
            value={familySize}
            onChange={(e) => setFamilySize(e.target.value)}
          />

          <Input
            label="Need Type"
            required
            value={needType}
            onChange={(e) => setNeedType(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
            >
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
