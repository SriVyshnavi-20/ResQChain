import React, { useState } from 'react';
import { NgoSidebar } from '../components/layout/NgoSidebar';
import { NgoMobileNav } from '../components/layout/NgoMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  MapPin,
  Clock,
  Phone,
  RefreshCw
} from 'lucide-react';

export const NgoVolunteersPage: React.FC = () => {
  const { ngoVolunteers, reassignNgoVolunteer, openSosModal, showToast } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'On Field' | 'At Hub' | 'Resting'>('All');

  // Reassign Modal State
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string | null>(null);
  const [newCamp, setNewCamp] = useState('Central District Hub #1');
  const [newTask, setNewTask] = useState('');

  const filteredVolunteers = ngoVolunteers.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.assignedCamp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.currentTask.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenReassign = (id: string, currentCamp: string, currentTask: string) => {
    setSelectedVolunteerId(id);
    setNewCamp(currentCamp);
    setNewTask(currentTask);
    setReassignModalOpen(true);
  };

  const handleSaveReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVolunteerId) {
      reassignNgoVolunteer(selectedVolunteerId, newCamp, newTask);
    }
    setReassignModalOpen(false);
  };

  const handleCall = (name: string, phone: string) => {
    showToast(`Calling volunteer ${name} (${phone})...`);
  };

  const getStatusBadgeVariant = (st: string) => {
    switch (st) {
      case 'On Field':
        return 'emergency';
      case 'At Hub':
        return 'resolved';
      case 'Resting':
        return 'neutral';
      default:
        return 'neutral';
    }
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
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                Personnel &amp; Field Squads
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">{ngoVolunteers.length} Active Field Responders</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Volunteer Coordination
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
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Search & Filters */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search volunteer by name, skill, camp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {(['All', 'On Field', 'At Hub', 'Resting'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    statusFilter === st
                      ? 'bg-navy-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Volunteer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVolunteers.map((vol) => (
              <Card
                key={vol.id}
                padding="lg"
                className="bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-sm">
                        {vol.name[0]}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{vol.name}</h3>
                        <p className="text-xs font-semibold text-brand-700">{vol.role}</p>
                      </div>
                    </div>

                    <StatusBadge
                      variant={getStatusBadgeVariant(vol.status)}
                      label={vol.status}
                      size="sm"
                    />
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>Camp: <strong>{vol.assignedCamp}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Current Task: <strong>{vol.currentTask}</strong></span>
                    </div>
                    <div className="text-slate-400 text-[11px] pt-1">
                      Hours on shift: <span className="font-mono text-slate-700 font-bold">{vol.hoursActive} hrs</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {vol.skills.map((skill) => (
                        <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${vol.phone}`}
                    onClick={() => handleCall(vol.name, vol.phone)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call
                  </a>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenReassign(vol.id, vol.assignedCamp, vol.currentTask)}
                    leftIcon={<RefreshCw className="w-3 h-3 text-navy-800" />}
                  >
                    Reassign
                  </Button>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </main>

      {/* Reassign Volunteer Modal */}
      <Modal
        isOpen={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
        title="Reassign Volunteer Mission / Camp"
        maxWidth="md"
      >
        <form onSubmit={handleSaveReassign} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Select Relief Camp
            </label>
            <select
              value={newCamp}
              onChange={(e) => setNewCamp(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-navy-800"
            >
              <option value="Central District Hub #1">Central District Hub #1 (Gandhi Rd)</option>
              <option value="South Sector Camp">South Sector Camp (Cathedral Rd)</option>
              <option value="Riverside Lowland Camp">Riverside Lowland Mobile Camp</option>
              <option value="Anna Nagar Shelter Camp">Anna Nagar Shelter Camp</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              New Assigned Field Directive
            </label>
            <input
              type="text"
              required
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="e.g. Triage intake, Drinking water delivery..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setReassignModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
            >
              Deploy Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
