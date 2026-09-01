import React, { useState } from 'react';
import { VolunteerSidebar } from '../components/layout/VolunteerSidebar';
import { VolunteerMobileNav } from '../components/layout/VolunteerMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { AvailabilityStatus } from '../types';
import {
  MapPin,
  CheckCircle2,
  Star,
  Edit3,
  Activity
} from 'lucide-react';

export const VolunteerProfilePage: React.FC = () => {
  const {
    user,
    volunteerAvailability,
    setVolunteerAvailability,
    updateProfile,
    openSosModal
  } = useAuth();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [availModalOpen, setAvailModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState(user?.name || 'Priya Nair');
  const [zone, setZone] = useState(user?.zone || 'Lakeview Zone');
  const [shift, setShift] = useState(user?.shift || '9:00 AM - 5:00 PM');
  const [skillsInput, setSkillsInput] = useState((user?.skills || ['Rescue', 'First Aid', 'Shelter Support']).join(', '));

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSkills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
    updateProfile({
      name,
      zone,
      shift,
      skills: parsedSkills
    });
    setEditModalOpen(false);
  };

  const handleSetAvailability = (status: AvailabilityStatus) => {
    setVolunteerAvailability(status);
    setAvailModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <VolunteerMobileNav />
      <VolunteerSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                Volunteer Registry
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Badge #{user?.badgeNumber || 'VOL-7719'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Volunteer Profile
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
          
          {/* Volunteer Hero Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 text-white border border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-lg border-2 border-emerald-400/50">
                  {user?.name?.[0] || 'P'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      {user?.name || 'Priya Nair'}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {user?.role || 'Volunteer'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <strong>Zone:</strong> {user?.zone || 'Lakeview Zone'} • <strong>Shift:</strong> {user?.shift || '9:00 AM - 5:00 PM'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                  volunteerAvailability === 'ACTIVE'
                    ? 'bg-emerald-900/80 border-emerald-700 text-emerald-200'
                    : volunteerAvailability === 'STANDBY'
                    ? 'bg-amber-900/80 border-amber-700 text-amber-200'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${volunteerAvailability === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : volunteerAvailability === 'STANDBY' ? 'bg-amber-400' : 'bg-slate-400'}`} />
                  Availability: {volunteerAvailability}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <Card padding="md" className="bg-white border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Tasks Completed</span>
              <span className="text-3xl font-black text-navy-900 font-mono mt-1 block">
                {user?.tasksCompleted ?? 18}
              </span>
              <span className="text-[11px] text-slate-400">Verified missions</span>
            </Card>

            <Card padding="md" className="bg-white border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">People Assisted</span>
              <span className="text-3xl font-black text-purple-700 font-mono mt-1 block">
                {user?.peopleAssisted ?? 42}
              </span>
              <span className="text-[11px] text-slate-400">Evacuated / fed</span>
            </Card>

            <Card padding="md" className="bg-white border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Field Rating</span>
              <div className="text-3xl font-black text-amber-600 font-mono mt-1 flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                {user?.rating ?? 4.8}
              </div>
              <span className="text-[11px] text-slate-400">From responders</span>
            </Card>
          </div>

          {/* Details & Skills Card */}
          <Card padding="lg" className="bg-white border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Skills &amp; Qualifications
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

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Certified Emergency Skills
                </span>
                <div className="flex flex-wrap gap-2">
                  {(user?.skills || ['Rescue', 'First Aid', 'Shelter Support']).map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl font-bold text-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block">Organization</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {user?.organization || 'Youth Rescue Brigade'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block">Contact Email</span>
                  <span className="text-sm font-mono font-semibold text-slate-900 mt-0.5 block">
                    {user?.email || 'priya.nair@resqchain.org'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
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
                onClick={() => setAvailModalOpen(true)}
                leftIcon={<Activity className="w-4 h-4" />}
              >
                UPDATE AVAILABILITY
              </Button>
            </div>

          </Card>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Volunteer Profile"
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
            label="Assigned Zone"
            required
            value={zone}
            onChange={(e) => setZone(e.target.value)}
          />

          <Input
            label="Daily Shift Hours"
            required
            value={shift}
            onChange={(e) => setShift(e.target.value)}
          />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Skills (comma separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy-800"
              placeholder="Rescue, First Aid, Shelter Support"
            />
          </div>

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

      {/* Update Availability Modal */}
      <Modal
        isOpen={availModalOpen}
        onClose={() => setAvailModalOpen(false)}
        title="Update Dispatch Availability"
        maxWidth="sm"
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Set your current response readiness for the automated dispatch queue:
          </p>

          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => handleSetAvailability('ACTIVE')}
              className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                volunteerAvailability === 'ACTIVE'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-500'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="text-sm font-bold block">ACTIVE</span>
                <span className="text-xs text-slate-500">Ready to receive emergency assignments</span>
              </div>
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
            </button>

            <button
              type="button"
              onClick={() => handleSetAvailability('STANDBY')}
              className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                volunteerAvailability === 'STANDBY'
                  ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold ring-1 ring-amber-500'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="text-sm font-bold block">STANDBY</span>
                <span className="text-xs text-slate-500">On reserve for critical emergencies only</span>
              </div>
              <span className="w-3 h-3 rounded-full bg-amber-500" />
            </button>

            <button
              type="button"
              onClick={() => handleSetAvailability('OFFLINE')}
              className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                volunteerAvailability === 'OFFLINE'
                  ? 'bg-slate-100 border-slate-600 text-slate-900 font-bold ring-1 ring-slate-600'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="text-sm font-bold block">OFFLINE</span>
                <span className="text-xs text-slate-500">Unavailable for dispatches</span>
              </div>
              <span className="w-3 h-3 rounded-full bg-slate-400" />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
