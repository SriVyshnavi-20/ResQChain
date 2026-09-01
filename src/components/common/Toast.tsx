import React from 'react';
import { Info, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Toast: React.FC = () => {
  const { toastMessage, hideToast } = useAuth();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-subtle">
      <div className="flex items-center gap-3 bg-navy-900 text-white px-4 py-3 rounded-xl shadow-lg border border-navy-700">
        <div className="p-1 rounded-full bg-brand-500/20 text-brand-300">
          <Info className="w-5 h-5" />
        </div>
        <p className="text-sm font-medium text-slate-100 flex-1">{toastMessage}</p>
        <button
          onClick={hideToast}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition-colors"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
