import React, { useState } from 'react';
import { NgoSidebar } from '../components/layout/NgoSidebar';
import { NgoMobileNav } from '../components/layout/NgoMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  MapPin,
  ShieldCheck,
  Edit3
} from 'lucide-react';

export const NgoProfilePage: React.FC = () => {
  const { user, updateProfile, openSosModal } = useAuth();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || 'Dr. Priya Sundaram');
  const [org, setOrg] = useState(user?.organization || 'Red Cross Disaster Relief Foundation');
  const [email, setEmail] = useState(user?.email || 'priya@redcrossrelief.org');
  const [phone, setPhone] = useState(user?.phone || '+91 94440 67890');
  const [location, setLocation] = useState(user?.location || 'T. Nagar Disaster Hub, Chennai');

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      organization: org,
      email,
      phone,
      location
    });
    setEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <NgoMobileNav />
      <NgoSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                Authorized NGO Partner
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Reg #{user?.registrationNumber || 'NGO-IND-TN-4092'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              NGO Profile
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
          
          {/* Org Hero Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 text-white border border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-2xl shadow-lg border-2 border-brand-400/50">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      {user?.organization || 'Red Cross Disaster Relief Foundation'}
                    </h2>
                  </div>
                  <p className="text-xs text-brand-300 mt-1">
                    Authorized Regional Emergency Partner • State Disaster Response Network
                  </p>
                </div>
              </div>

              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                VERIFIED NGO
              </span>
            </div>
          </div>

          {/* Operational Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <Card padding="md" className="bg-white border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Relief Camps</span>
              <span className="text-3xl font-black text-navy-900 font-mono mt-1 block">
                {user?.activeCampsCount ?? 3}
              </span>
              <span className="text-[11px] text-slate-400">Hubs fully operational</span>
            </Card>

            <Card padding="md" className="bg-white border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Supplies Dispatched</span>
              <span className="text-3xl font-black text-emerald-700 font-mono mt-1 block">
                {user?.suppliesDispatchedCount?.toLocaleString() ?? '14,250'}
              </span>
              <span className="text-[11px] text-slate-400">Total units delivered</span>
            </Card>

            <Card padding="md" className="bg-white border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Assigned Zones</span>
              <span className="text-3xl font-black text-brand-700 font-mono mt-1 block">
                3 Sectors
              </span>
              <span className="text-[11px] text-slate-400">Central, South &amp; Riverside</span>
            </Card>
          </div>

          {/* Details Card */}
          <Card padding="lg" className="bg-white border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Official Entity &amp; Leadership Details
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Authorized Lead / Director</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{user?.name || 'Dr. Priya Sundaram'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Registration Number</span>
                <span className="text-sm font-mono font-bold text-navy-900 mt-0.5 block">{user?.registrationNumber || 'NGO-IND-TN-4092'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Official Email</span>
                <span className="text-sm font-mono font-semibold text-slate-900 mt-0.5 block">{user?.email || 'priya@redcrossrelief.org'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Emergency Hotline Phone</span>
                <span className="text-sm font-mono font-bold text-slate-900 mt-0.5 block">{user?.phone || '+91 94440 67890'}</span>
              </div>

              <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Primary Headquarters / Base Depot</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  {user?.location || 'T. Nagar Disaster Hub, Chennai'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={() => setEditModalOpen(true)}
                leftIcon={<Edit3 className="w-4 h-4" />}
              >
                EDIT PROFILE
              </Button>
            </div>

          </Card>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit NGO Entity Information"
        maxWidth="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Director / Lead Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Organization Name"
            required
            value={org}
            onChange={(e) => setOrg(e.target.value)}
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Hotline Phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            label="Headquarters / Base Location"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
