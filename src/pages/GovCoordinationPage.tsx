import React, { useState } from 'react';
import { GovSidebar } from '../components/layout/GovSidebar';
import { GovMobileNav } from '../components/layout/GovMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  MapPin,
  RefreshCw,
  Plus,
  Radio
} from 'lucide-react';

export const GovCoordinationPage: React.FC = () => {
  const { govAgencies, reassignAgency, requisitionReinforcements, triggerMutualAid, openSosModal } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const [newSector, setNewSector] = useState('Adyar River Basin (Zone 4)');

  const filteredAgencies = govAgencies.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.assignedSector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenReassign = (id: string, currentSector: string) => {
    setSelectedAgencyId(id);
    setNewSector(currentSector);
    setReassignModalOpen(true);
  };

  const handleExecuteReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAgencyId) {
      reassignAgency(selectedAgencyId, newSector);
    }
    setReassignModalOpen(false);
  };

  const handleReinforcements = () => {
    requisitionReinforcements();
  };

  const handleMutualAid = () => {
    triggerMutualAid();
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
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Unified Field Force Command
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">{govAgencies.length} Multi-Agency Taskforces Deployed</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Multi-Agency Response Coordination
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReinforcements}
              leftIcon={<Plus className="w-4 h-4 text-purple-600" />}
            >
              Requisition Reinforcements
            </Button>
            <Button
              variant="sos"
              size="sm"
              onClick={openSosModal}
              className="shadow-sm font-bold"
            >
              EMERGENCY SOS
            </Button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Action Ribbon */}
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Radio className="w-5 h-5 text-purple-700 animate-pulse shrink-0" />
              <div>
                <span className="text-sm font-bold block">Inter-Agency Relief Taskforce Grid</span>
                <p className="text-xs text-purple-900/80">Coordinate Armed Forces, Police, NGOs, and Volunteer Brigades in real time.</p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleMutualAid}
              className="bg-purple-800 hover:bg-purple-900 shrink-0"
            >
              Trigger Mutual Aid
            </Button>
          </div>

          {/* Search Bar */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search agency, commander, sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Agency Matrix Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAgencies.map((agency) => (
              <Card
                key={agency.id}
                padding="lg"
                className="bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{agency.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {agency.status}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                    {agency.type}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{agency.name}</h3>

                  <div className="mt-3.5 space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    <div>
                      <span className="text-slate-400 font-semibold block">Incident Commander:</span>
                      <span className="font-bold text-slate-900">{agency.commandLead}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block">Assigned Sector:</span>
                      <span className="font-bold text-red-700 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        {agency.assignedSector}
                      </span>
                    </div>

                    <div className="pt-1 text-slate-600 flex items-center justify-between border-t border-slate-200/60">
                      <span>Field Troops Active:</span>
                      <span className="font-mono font-bold text-navy-900">{agency.activePersonnel} Personnel</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => handleOpenReassign(agency.id, agency.assignedSector)}
                    leftIcon={<RefreshCw className="w-3.5 h-3.5 text-navy-900" />}
                  >
                    Redeploy to Sector
                  </Button>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </main>

      {/* Redeploy Agency Modal */}
      <Modal
        isOpen={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
        title="Redeploy Agency Taskforce / Battalion"
        maxWidth="md"
      >
        <form onSubmit={handleExecuteReassign} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Select Strategic Operational Sector
            </label>
            <select
              value={newSector}
              onChange={(e) => setNewSector(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-navy-800"
            >
              <option value="Adyar River Basin (Zone 4)">Adyar River Basin (Zone 4)</option>
              <option value="Marina Coastal Belt (Zone 9)">Marina Coastal Belt (Zone 9)</option>
              <option value="Downtown Substation Sector 4">Downtown Substation Sector 4</option>
              <option value="Central District Relief Hubs">Central District Relief Hubs</option>
              <option value="Riverside Lowland Causeway">Riverside Lowland Causeway</option>
            </select>
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
              Authorize Redeployment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
