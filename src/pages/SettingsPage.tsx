import React, { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileNav } from '../components/layout/MobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  Moon,
  Mail,
  Save
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updatePreferences, openSosModal } = useAuth();

  const [criticalAlerts, setCriticalAlerts] = useState(user?.preferences?.criticalAlerts ?? true);
  const [darkMode, setDarkMode] = useState(user?.preferences?.darkMode ?? false);
  const [dailySummaryEmail, setDailySummaryEmail] = useState(user?.preferences?.dailySummaryEmail ?? false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      criticalAlerts,
      darkMode,
      dailySummaryEmail
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <MobileNav />
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                User Configuration
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Victim Account</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              SETTINGS
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
              <div className="w-12 h-12 rounded-2xl bg-navy-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {user?.name?.[0] || 'A'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {user?.name || 'Anvitha Shetty'}
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                  {user?.email || 'anvi123@org'}
                </span>
              </div>
            </div>

            {/* Section Heading */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Account and System Preferences
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage emergency push notifications, interface theme, and digest subscriptions.
              </p>
            </div>

            {/* Preference Toggles Form */}
            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Toggle 1: Critical Alerts */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-100 text-red-700 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      Critical Alert Notifications
                    </span>
                    <p className="text-xs text-slate-500">
                      Receive instantaneous sound and vibration alerts for Red Alert floods &amp; cyclones.
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

              {/* Toggle 2: Dark Mode */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-200 text-slate-800 mt-0.5">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      Dark Mode
                    </span>
                    <p className="text-xs text-slate-500">
                      High-contrast battery conservation theme for low-power disaster emergencies.
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

              {/* Toggle 3: Daily Summary Email */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-brand-700 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      Daily Summary Email
                    </span>
                    <p className="text-xs text-slate-500">
                      Receive daily updates on local relief distribution camps and water levels.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={dailySummaryEmail}
                    onChange={(e) => setDailySummaryEmail(e.target.checked)}
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
