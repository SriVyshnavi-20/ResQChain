import React, { useState } from 'react';
import { GovSidebar } from '../components/layout/GovSidebar';
import { GovMobileNav } from '../components/layout/GovMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  ShieldAlert,
  AlertTriangle,
  Info,
  Clock,
  MapPin,
  Building2,
  Radio,
  Send
} from 'lucide-react';

export const GovAlertsPage: React.FC = () => {
  const { announcements, createOfficialAlert, openSosModal } = useAuth();

  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'emergency' | 'warning' | 'info'>('emergency');
  const [zone, setZone] = useState('Riverside Lowland Zone');

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOfficialAlert({
      title,
      message,
      type,
      zone
    });
    setBroadcastModalOpen(false);
    setTitle('');
    setMessage('');
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
              <span className="text-xs font-semibold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                State Emergency Broadcast Network
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">CAP Protocol Unified Public Alert Channel</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Official Alerts &amp; Announcements
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setBroadcastModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="bg-red-700 hover:bg-red-800"
            >
              Broadcast Emergency Alert
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
        <div className="p-4 sm:p-8 max-w-5xl w-full mx-auto space-y-6">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-600 animate-pulse" />
              Active Public Directives &amp; Siren Alerts
            </h2>
            <span className="text-xs text-slate-500">{announcements.length} Broadcasted Directives</span>
          </div>

          {/* Broadcast Feed */}
          <div className="space-y-4">
            {announcements.map((ann) => {
              const isEmergency = ann.type === 'emergency';
              const isWarning = ann.type === 'warning';

              const bgStyle = isEmergency
                ? 'bg-red-50/80 border-red-200 text-red-950'
                : isWarning
                ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                : 'bg-sky-50/70 border-sky-200 text-sky-950';

              const iconBoxStyle = isEmergency
                ? 'bg-red-200/80 text-red-900'
                : isWarning
                ? 'bg-amber-200/80 text-amber-900'
                : 'bg-sky-200/80 text-sky-900';

              return (
                <Card
                  key={ann.id}
                  padding="lg"
                  className={`border shadow-xs ${bgStyle}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 ${iconBoxStyle}`}>
                        {isEmergency ? (
                          <ShieldAlert className="w-5 h-5" />
                        ) : isWarning ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : (
                          <Info className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-base font-extrabold tracking-tight ${isEmergency ? 'text-red-950' : isWarning ? 'text-amber-950' : 'text-sky-950'}`}>
                            {ann.title}
                          </h3>
                          <StatusBadge
                            variant={ann.type}
                            label={isEmergency ? 'Level-3 Emergency' : isWarning ? 'Urgent Warning' : 'Public Information'}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 shrink-0">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {ann.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="py-3.5">
                    <p className={`text-sm leading-relaxed ${isEmergency ? 'text-red-950' : isWarning ? 'text-amber-950' : 'text-sky-950'}`}>
                      {ann.message}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <strong>Affected Sector:</strong> {ann.zone || 'Statewide'}
                    </span>

                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Building2 className="w-3.5 h-3.5" />
                      Authorized: {ann.issuedBy || 'State Disaster Operations Center'}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>

        </div>
      </main>

      {/* Broadcast Alert Modal */}
      <Modal
        isOpen={broadcastModalOpen}
        onClose={() => setBroadcastModalOpen(false)}
        title="Broadcast Statewide Emergency Alert (CAP)"
        maxWidth="md"
      >
        <form onSubmit={handleBroadcastSubmit} className="space-y-4">
          <Input
            label="Alert Headline"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. FLASH FLOOD RED ALERT - ADYAR BASIN"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Severity Level
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="emergency">Emergency (Red Siren / Immediate Evacuation)</option>
                <option value="warning">Warning (Orange / Standby Prep)</option>
                <option value="info">Information (Yellow / Relief Update)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Targeted Zone / District
              </label>
              <input
                type="text"
                required
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                placeholder="e.g. Riverside Lowland Zone"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Public Directive Message
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Immediate instructions for citizens, volunteers, and relief NGOs..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-900 text-xs flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-600 shrink-0" />
            <span>This broadcast will immediately trigger across Victim, Volunteer, and NGO app feeds.</span>
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
              className="bg-red-700 hover:bg-red-800"
            >
              Transmit Broadcast
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
