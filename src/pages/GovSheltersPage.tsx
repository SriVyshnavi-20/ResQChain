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
  Users,
  Plus
} from 'lucide-react';

export const GovSheltersPage: React.FC = () => {
  const { shelters, expandShelterCapacity, openSosModal, showToast } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandModalOpen, setExpandModalOpen] = useState(false);
  const [selectedShelterId, setSelectedShelterId] = useState<string | null>(null);
  const [extraBeds, setExtraBeds] = useState<number>(50);

  const filteredShelters = shelters.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenExpand = (id: string) => {
    setSelectedShelterId(id);
    setExtraBeds(50);
    setExpandModalOpen(true);
  };

  const handleExecuteExpand = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedShelterId && extraBeds > 0) {
      expandShelterCapacity(selectedShelterId, Number(extraBeds));
    }
    setExpandModalOpen(false);
  };

  const handleAudit = (shelterName: string) => {
    showToast(`Disaster Safety & Food Hygiene audit cleared for ${shelterName}.`);
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
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                State Evacuation &amp; Relief Infrastructure
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">19 Designated Disaster Relief Camps</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Shelter Infrastructure Management
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
          
          {/* Search Bar */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search shelter by name, sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Users className="w-4 h-4 text-brand-600" />
              <span>Real-time Bedding Occupancy &amp; Resource Allocation</span>
            </div>
          </div>

          {/* Shelters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredShelters.map((shelter) => {
              const occPct = Math.round((shelter.occupancy / shelter.capacity) * 100);
              const isNearFull = occPct >= 80;

              return (
                <Card
                  key={shelter.id}
                  padding="lg"
                  className="bg-white border-slate-200/90 hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{shelter.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>{shelter.address}</span>
                        </p>
                      </div>

                      <span className={`px-2 py-1 rounded-lg text-xs font-mono font-bold ${
                        isNearFull ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {occPct}% Full
                      </span>
                    </div>

                    {/* Capacity Meter */}
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-600">Current Occupancy:</span>
                        <span className="font-bold font-mono text-navy-900">
                          {shelter.occupancy} / {shelter.capacity} Beds
                        </span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full ${isNearFull ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${occPct}%` }}
                        />
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                        <span>Available Beds: <strong className="text-slate-700">{shelter.availableSpaces}</strong></span>
                        <span>Hotline: {shelter.contactPhone}</span>
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="mt-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Provisioned Supplies:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {shelter.resources.map((res) => (
                          <span
                            key={res}
                            className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded"
                          >
                            ✓ {res}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAudit(shelter.name)}
                    >
                      Audit Safety
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenExpand(shelter.id)}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      className="bg-navy-900 hover:bg-navy-950"
                    >
                      Expand Capacity
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

        </div>
      </main>

      {/* Expand Shelter Capacity Modal */}
      <Modal
        isOpen={expandModalOpen}
        onClose={() => setExpandModalOpen(false)}
        title="Expand Evacuation Camp Capacity"
        maxWidth="sm"
      >
        <form onSubmit={handleExecuteExpand} className="space-y-4">
          <p className="text-xs text-slate-600">
            Requisition emergency bedding, mobile tents, and food ration supply pipelines to expand camp intake.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Additional Bed Capacity
            </label>
            <input
              type="number"
              required
              min={10}
              step={10}
              value={extraBeds}
              onChange={(e) => setExtraBeds(Number(e.target.value))}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-base font-mono font-bold focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setExpandModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
            >
              Authorize Expansion
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
