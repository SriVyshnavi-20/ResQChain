import React, { useState } from 'react';
import { GovSidebar } from '../components/layout/GovSidebar';
import { GovMobileNav } from '../components/layout/GovMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  Radio,
  Building2,
  Moon,
  Mail,
  Save
} from 'lucide-react';

export const GovSettingsPage: React.FC = () => {
  const { user, updatePreferences, openSosModal } = useAuth();

  const [criticalAlerts, setCriticalAlerts] = useState(user?.preferences?.criticalAlerts ?? true);
  const [disasterEscalationAlerts, setDisasterEscalationAlerts] = useState(user?.preferences?.disasterEscalationAlerts ?? true);
  const [interAgencyBroadcasts, setInterAgencyBroadcasts] = useState(user?.preferences?.interAgencyBroadcasts ?? true);
  const [darkMode, setDarkMode] = useState(user?.preferences?.darkMode ?? false);
  const [dailySummary, setDailySummary] = useState(user?.preferences?.dailySummary ?? true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      criticalAlerts,
      disasterEscalationAlerts,
      interAgencyBroadcasts,
      darkMode,
      dailySummary
    });
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
                Command Console Configuration
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">State Emergency Broadcast &amp; Siren Protocols</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Government System Settings
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
          
          <Card padding="lg" className="bg-white border-slate-200 shadow-sm space-y-6">
            
            {/* Account Strip */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {user?.name || 'R. Rajesh IAS'} ({user?.department || 'TNSDMA'})
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                  {user?.email || 'rajesh.sdma@gov.in'} • State Official #{user?.officialId || 'GOV-TN-IAS-109'}
                </span>
              </div>
            </div>

            {/* Section Heading */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                State Incident Dispatch &amp; Alert Siren Preferences
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure automated siren escalations, inter-agency broadcast sync, and daily midnight SITREP generation.
              </p>
            </div>

            {/* Preferences Form */}
            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Toggle 1: Critical Alerts */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-100 text-red-700 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      Level-3 Emergency Siren Alarms
                    </span>
                    <p className="text-xs text-slate-500">
                      High-priority command alarm when dam water discharge exceeds dangerous threshold.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={criticalAlerts}
                    onChange={(e) => setCriticalAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-900" />
                </label>
              </div>

              {/* Toggle 2: Disaster Escalation */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-800 mt-0.5">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      NDRF Automatic Escalation Notifications
                    </span>
                    <p className="text-xs text-slate-500">
                      Instant alerts when citizen distress calls remain unassigned for over 15 minutes.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={disasterEscalationAlerts}
                    onChange={(e) => setDisasterEscalationAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-900" />
                </label>
              </div>

              {/* Toggle 3: Inter-Agency Broadcast Sync */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      Inter-Agency Broadcast Synchronization
                    </span>
                    <p className="text-xs text-slate-500">
                      Sync state broadcasts directly to Indian Red Cross, NDRF Battalion, and Police feeds.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={interAgencyBroadcasts}
                    onChange={(e) => setInterAgencyBroadcasts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-900" />
                </label>
              </div>

              {/* Toggle 4: Dark Mode */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-200 text-slate-800 mt-0.5">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      High-Contrast Dark Mode
                    </span>
                    <p className="text-xs text-slate-500">
                      Reduced eye fatigue theme for 24x7 control room video walls.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-900" />
                </label>
              </div>

              {/* Toggle 5: Daily Summary Digest */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      Daily Midnight SITREP Dispatch
                    </span>
                    <p className="text-xs text-slate-500">
                      Automated PDF situation report dispatched to Chief Minister &amp; Chief Secretary office.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={dailySummary}
                    onChange={(e) => setDailySummary(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-900" />
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  SAVE CHANGES
                </Button>
              </div>

            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};
