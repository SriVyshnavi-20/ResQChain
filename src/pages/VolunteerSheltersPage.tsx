import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VolunteerSidebar } from '../components/layout/VolunteerSidebar';
import { VolunteerMobileNav } from '../components/layout/VolunteerMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Search,
  MapPin,
  Users,
  Navigation,
  ArrowRight
} from 'lucide-react';

export const VolunteerSheltersPage: React.FC = () => {
  const { shelters, openSosModal, showToast } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<string>('All');

  const resources = ['All', 'Food', 'Water', 'Medical', 'Clothing'];

  const filteredShelters = shelters.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.zone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesResource =
      selectedResource === 'All' ||
      s.resources.includes(selectedResource as any);

    return matchesSearch && matchesResource;
  });

  const handleDirections = (shelterName: string) => {
    showToast(`Routing to ${shelterName}: Assigned escort path open.`);
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
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                Relief Camps &amp; Evacuation Points
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Volunteer Logistics Network</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Nearby Shelters
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
          
          {/* Top Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-950 to-slate-900 text-white flex items-center justify-between shadow-xs">
              <div>
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Active Shelters</span>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                  19 Open
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Assigned volunteer support active</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/10 text-emerald-400">
                <Home className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-950 text-white flex items-center justify-between shadow-xs">
              <div>
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Total Bedding Capacity</span>
                <div className="text-3xl font-extrabold text-white font-mono mt-1">
                  1,240 Total Capacity
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Coordinated with NDRF &amp; Red Cross</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/10 text-brand-300">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Search Bar & Filters */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Shelters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-slate-500 shrink-0">Filter by Resource:</span>
              {resources.map((res) => (
                <button
                  key={res}
                  onClick={() => setSelectedResource(res)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    selectedResource === res
                      ? 'bg-navy-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          {/* Shelters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredShelters.map((shelter) => (
              <Card
                key={shelter.id}
                padding="lg"
                className="bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {shelter.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>{shelter.address}</span>
                      </p>
                    </div>

                    <span className="inline-flex text-xs font-mono font-bold px-2 py-1 bg-blue-50 text-brand-800 rounded-lg shrink-0">
                      {shelter.distanceKm} km
                    </span>
                  </div>

                  {/* Capacity line */}
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Capacity:
                    </span>
                    <span className="font-bold text-navy-900 font-mono">
                      {shelter.occupancy} / {shelter.capacity}
                    </span>
                  </div>

                  {/* Available Resources */}
                  <div className="mt-3.5">
                    <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1.5">
                      Available:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {shelter.resources.map((res) => (
                        <span
                          key={res}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold"
                        >
                          ✓ {res}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDirections(shelter.name)}
                    leftIcon={<Navigation className="w-3.5 h-3.5" />}
                  >
                    DIRECTIONS
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/victim/shelter/${shelter.id}`)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    VIEW DETAILS
                  </Button>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};
