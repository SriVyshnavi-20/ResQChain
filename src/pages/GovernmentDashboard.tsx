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
  Building2,
  Radio,
  AlertTriangle,
  Send,
  ShieldAlert,
  Activity,
  PhoneCall,
  Plus
} from 'lucide-react';

export const GovernmentDashboard: React.FC = () => {
  const { user, announcements, broadcastAnnouncement, openSosModal } = useAuth();
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);

  // Broadcast form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'emergency' | 'warning' | 'info'>('warning');
  const [zone, setZone] = useState('All Coastal & Lowland Sectors');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    broadcastAnnouncement({
      title,
      message,
      type,
      zone,
      issuedBy: user?.organization || 'State Disaster Management Authority'
    });

    setTitle('');
    setMessage('');
    setBroadcastModalOpen(false);
  };

  const zones = [
    { name: 'Riverside Zone (Adyar / Cooum)', risk: 'Critical', waterLevel: '+3.2m above danger' },
    { name: 'Coastal Lowland Sector', risk: 'High', waterLevel: 'Tidal surge active' },
    { name: 'Central Commercial Hub', risk: 'Moderate', waterLevel: 'Water receding' },
    { name: 'North Chennai Industrial Belt', risk: 'High', waterLevel: 'Waterlogged' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <MobileNav />
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                Disaster Management Command
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">{user?.organization || 'State Disaster Management Authority'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Government Control Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Radio className="w-4 h-4 text-red-400 animate-pulse" />}
              className="bg-purple-900 hover:bg-purple-950"
              onClick={() => setBroadcastModalOpen(true)}
            >
              Broadcast Alert
            </Button>
            <Button
              variant="sos"
              size="sm"
              onClick={openSosModal}
              className="shadow-sm font-bold"
            >
              SOS
            </Button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* Government Control Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">NDRF Teams Deployed</span>
                <div className="text-2xl font-black text-navy-900 font-mono mt-0.5">
                  18 Units
                </div>
              </div>
              <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Distress Signals</span>
                <div className="text-2xl font-black text-red-600 font-mono mt-0.5">
                  48 Active
                </div>
              </div>
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Shelters Active</span>
                <div className="text-2xl font-black text-emerald-600 font-mono mt-0.5">
                  32 Centers
                </div>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">Helpline Uptime</span>
                <div className="text-2xl font-black text-navy-900 font-mono mt-0.5">
                  99.9%
                </div>
              </div>
              <div className="p-3 bg-blue-50 text-brand-700 rounded-xl">
                <PhoneCall className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* 2-Column: Zonal Threat Radar & Broadcast Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Broadcasted Alerts */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-purple-700" />
                  Live Official Broadcasts ({announcements.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setBroadcastModalOpen(true)}
                >
                  New Alert
                </Button>
              </div>

              <div className="space-y-3">
                {announcements.map((ann) => (
                  <Card
                    key={ann.id}
                    padding="md"
                    className={`border ${
                      ann.type === 'emergency'
                        ? 'bg-red-50/70 border-red-200'
                        : ann.type === 'warning'
                        ? 'bg-amber-50/70 border-amber-200'
                        : 'bg-sky-50/70 border-sky-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          variant={ann.type}
                          label={ann.type.toUpperCase()}
                          size="sm"
                        />
                        <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {ann.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {ann.message}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Zone: <strong>{ann.zone || 'All Sectors'}</strong></span>
                      <span>Issued: <strong>{ann.issuedBy || 'SDMA'}</strong></span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right: Zonal Threat Monitoring */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Disaster Zone Risk Matrix
              </h3>

              <div className="space-y-3">
                {zones.map((z) => (
                  <Card key={z.name} padding="md" className="bg-white border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-slate-900">{z.name}</h4>
                      <StatusBadge
                        variant={
                          z.risk === 'Critical'
                            ? 'emergency'
                            : z.risk === 'High'
                            ? 'warning'
                            : 'info'
                        }
                        label={z.risk}
                        size="sm"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {z.waterLevel}
                    </p>
                  </Card>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Broadcast Modal */}
      <Modal
        isOpen={broadcastModalOpen}
        onClose={() => setBroadcastModalOpen(false)}
        title="Broadcast Zonal Disaster Alert"
        maxWidth="lg"
      >
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Alert Severity
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['emergency', 'warning', 'info'] as const).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setType(sev)}
                  className={`p-2.5 rounded-lg border text-xs font-bold text-center capitalize transition-colors cursor-pointer ${
                    type === sev
                      ? 'bg-navy-900 text-white border-navy-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Alert Headline"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Flash Flood Evacuation Notice"
          />

          <Input
            label="Target Zonal Sector"
            required
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            placeholder="e.g. Riverside Sector 4"
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Public Advisory Message
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter official instructions for citizens..."
              className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800 bg-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setBroadcastModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Send className="w-4 h-4" />}
            >
              Broadcast to Platform
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
