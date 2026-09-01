import React, { useState } from 'react';
import { GovSidebar } from '../components/layout/GovSidebar';
import { GovMobileNav } from '../components/layout/GovMobileNav';
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

export const GovProfilePage: React.FC = () => {
  const { user, updateProfile, openSosModal } = useAuth();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || 'R. Rajesh IAS');
  const [designation, setDesignation] = useState(user?.designation || 'Principal Secretary & State Relief Commissioner');
  const [department, setDepartment] = useState(user?.department || 'Tamil Nadu State Disaster Management Authority (TNSDMA)');
  const [email, setEmail] = useState(user?.email || 'rajesh.sdma@gov.in');
  const [phone, setPhone] = useState(user?.phone || '+91 44 2859 3990');
  const [location, setLocation] = useState(user?.location || 'Ezhilagam, Chepauk, Chennai');

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      designation,
      department,
      email,
      phone,
      location
    });
    setEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <GovMobileNav />
      <GovSidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Official Incident Commander Profile
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">State Service Card #{user?.officialId || 'GOV-TN-IAS-109'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Government Official Profile
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
          
          {/* Government Executive Hero Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-navy-950 text-white border border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black text-2xl shadow-lg border-2 border-amber-400/50">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      {user?.name || 'R. Rajesh IAS'}
                    </h2>
                  </div>
                  <p className="text-xs text-amber-300 mt-1">
                    {user?.designation || 'Principal Secretary & State Relief Commissioner'}
                  </p>
                </div>
              </div>

              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 self-start sm:self-auto flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                STATE RELIEF COMMISSIONER
              </span>
            </div>
          </div>

          {/* Details Card */}
          <Card padding="lg" className="bg-white border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Official Government Credentials &amp; Jurisdiction
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
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Official Name</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{user?.name || 'R. Rajesh IAS'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Official ID Code</span>
                <span className="text-sm font-mono font-bold text-navy-900 mt-0.5 block">{user?.officialId || 'GOV-TN-IAS-109'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Department / Authority</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{user?.department || 'TNSDMA'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Jurisdiction Scope</span>
                <span className="text-sm font-semibold text-slate-900 mt-0.5 block">{user?.jurisdiction || 'Statewide / Chennai Metro'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Official Email</span>
                <span className="text-sm font-mono font-semibold text-slate-900 mt-0.5 block">{user?.email || 'rajesh.sdma@gov.in'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Emergency Control Room Line</span>
                <span className="text-sm font-mono font-bold text-slate-900 mt-0.5 block">{user?.phone || '+91 44 2859 3990'}</span>
              </div>

              <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Headquarters Command Center</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  {user?.location || 'Ezhilagam, Chepauk, Chennai'}
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
        title="Edit Government Official Profile"
        maxWidth="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Officer Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Designation &amp; Portfolio"
            required
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />

          <Input
            label="Department / Agency"
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />

          <Input
            label="Official Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Control Room Hotline Phone"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            label="Headquarters Location"
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
