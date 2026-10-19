import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { AlertOctagon, CheckCircle2, MapPin, PhoneCall, ShieldAlert, Clock, UserCheck } from 'lucide-react';

export const SosModal: React.FC = () => {
  const { isSosModalOpen, closeSosModal, triggerSos, sosAlert, clearSos, user } = useAuth();
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<string>('Flood / Waterlogging');

  const emergencyTypes = [
    'Flood / Waterlogging',
    'Medical Emergency',
    'Trapped / Rescue Needed',
    'Food & Drinking Water Shortage'
  ];

  const handleClose = () => {
    setIsSent(false);
    clearSos();
    closeSosModal();
  };

  const handleSendSos = async () => {
    if (isSending) return;
    setIsSending(true);
    const alert = await triggerSos(selectedEmergencyType);
    setIsSending(false);
    if (alert) setIsSent(true);
  };

  return (
    <Modal
      isOpen={isSosModalOpen}
      onClose={handleClose}
      title={isSent ? 'SOS Alert Confirmation' : 'Emergency SOS Request'}
      maxWidth="md"
    >
      {!isSent ? (
        <div className="space-y-5">
          {/* Header icon and alert message */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-950">
            <div className="p-3 bg-red-600 text-white rounded-xl shadow-md shrink-0 animate-pulse">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-red-900">Emergency SOS</h4>
              <p className="text-sm text-red-700 mt-1">
                Are you sure you want to send an emergency SOS?
              </p>
              <p className="text-xs text-red-600 mt-1">
                This will immediately broadcast your GPS coordinates and profile to emergency first responders, NDRF, and nearby volunteer units.
              </p>
            </div>
          </div>

          {/* User location confirmation */}
          <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Victim Name:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-navy-700" /> {user?.name || 'Emergency User'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Broadcast Location:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-600" /> {user?.location || 'Current GPS location'}
              </span>
            </div>
          </div>

          {/* Emergency type selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Emergency Situation (Optional)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {emergencyTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedEmergencyType(type)}
                  className={`text-xs font-medium px-3 py-2 rounded-lg border text-left transition-colors cursor-pointer ${
                    selectedEmergencyType === type
                      ? 'border-red-600 bg-red-50/80 text-red-900 font-semibold'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              size="md"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="sos"
              size="md"
              disabled={isSending}
              leftIcon={<ShieldAlert className="w-4 h-4" />}
              onClick={handleSendSos}
            >
              {isSending ? 'SENDING...' : 'SEND SOS'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-5 py-2">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h4 className="text-xl font-bold text-slate-900 tracking-tight">
              SOS ALERT SENT
            </h4>
            <p className="text-sm text-slate-600 mt-1.5">
              Emergency assistance has been requested.
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-medium text-slate-500">Request ID</span>
              <span className="text-sm font-mono font-bold text-navy-900">
                {sosAlert?.requestId || 'SOS-2587'}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-medium text-slate-500">Status</span>
              <StatusBadge
                variant="emergency"
                label={sosAlert?.status || 'Emergency Alert Sent'}
                size="sm"
              />
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-medium text-slate-500">Dispatch Location</span>
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                {sosAlert?.location || 'Current GPS location'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Timestamp</span>
              <span className="text-xs text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {sosAlert?.timestamp || 'Just now'}
              </span>
            </div>
          </div>

          {/* Important instructions */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 text-left flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              Please keep your phone powered on and stay in the highest accessible safe location. First responders have been notified.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="tel:112"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              Call 112 Helpline
            </a>
            <Button
              variant="outline"
              size="md"
              fullWidth={false}
              className="w-full sm:w-auto"
              onClick={handleClose}
            >
              Close Window
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
