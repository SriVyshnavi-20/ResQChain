import React, { useState } from 'react';
import { NgoSidebar } from '../components/layout/NgoSidebar';
import { NgoMobileNav } from '../components/layout/NgoMobileNav';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  Package,
  Truck,
  Moon,
  Mail,
  Save,
  Building2
} from 'lucide-react';

export const NgoSettingsPage: React.FC = () => {
  const { user, updatePreferences, openSosModal } = useAuth();

  const [criticalAlerts, setCriticalAlerts] = useState(user?.preferences?.criticalAlerts ?? true);
  const [supplyDepletionAlerts, setSupplyDepletionAlerts] = useState(user?.preferences?.supplyDepletionAlerts ?? true);
  const [dispatchConfirmations, setDispatchConfirmations] = useState(user?.preferences?.dispatchConfirmations ?? true);
  const [darkMode, setDarkMode] = useState(user?.preferences?.darkMode ?? false);
  const [dailySummary, setDailySummary] = useState(user?.preferences?.dailySummary ?? true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      criticalAlerts,
      supplyDepletionAlerts,
      dispatchConfirmations,
      darkMode,
      dailySummary
    });
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
                NGO Operations Configuration
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">System Alert Thresholds</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Settings &amp; Preferences
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
              <div className="w-12 h-12 rounded-2xl bg-brand-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {user?.organization || 'Red Cross Disaster Relief Foundation'}
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                  {user?.email || 'priya@redcrossrelief.org'} • Reg #{user?.registrationNumber || 'NGO-IND-TN-4092'}
                </span>
              </div>
            </div>

            {/* Section Heading */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Relief Dispatch &amp; Stock Alert Preferences
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure automated warnings for warehouse stock depletion and dispatch confirmation modals.
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
                      Critical Disaster Alerts
                    </span>
                    <p className="text-xs text-slate-500">
                      Emergency push alerts when State Disaster Authority broadcasts Level-3 flood or cyclone warnings.
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

              {/* Toggle 2: Supply Depletion Alerts */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-800 mt-0.5">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      Supply Depletion Alerts
                    </span>
                    <p className="text-xs text-slate-500">
                      Notify logistics managers when food, water or medical kits drop below 25% minimum threshold.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={supplyDepletionAlerts}
                    onChange={(e) => setSupplyDepletionAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-900" />
                </label>
              </div>

              {/* Toggle 3: Dispatch Confirmations */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-brand-700 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      Dispatch Confirmations
                    </span>
                    <p className="text-xs text-slate-500">
                      Require digital authorization sign-off prior to releasing large truck consignments.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={dispatchConfirmations}
                    onChange={(e) => setDispatchConfirmations(e.target.checked)}
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
                      Dark Mode Theme
                    </span>
                    <p className="text-xs text-slate-500">
                      Optimized battery conservation theme for field tablet terminals.
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
                      Daily Logistics Digest
                    </span>
                    <p className="text-xs text-slate-500">
                      Comprehensive midnight report covering stock burn rates, resolved tickets, and camp intake.
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
