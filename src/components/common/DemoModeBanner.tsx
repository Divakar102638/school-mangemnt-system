import React, { useState } from 'react';
import { AlertCircle, RotateCcw, ShieldAlert } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ConfirmDialog } from './ConfirmDialog';

export const DemoModeBanner: React.FC = () => {
  const { resetDemoData } = useData();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-slate-900 via-navy-800 to-slate-900 text-white px-4 py-2 border-b border-teal-500/30 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold text-xs border border-teal-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              DEMO MODE
            </span>
            <span className="text-slate-300 hidden md:inline">
              Frontend prototype with local browser persistence by <strong className="text-white">L.Tech Solutions</strong>. No external database connected.
            </span>
            <span className="text-slate-300 md:hidden">
              Frontend prototype (Demo mode)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowConfirm(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
              title="Restore initial fictional campus data"
            >
              <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
              Reset Demo Data
            </button>
            <div className="hidden lg:flex items-center gap-1 text-slate-400 text-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Phase 1 Super Admin Portal</span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Reset Demo Data to Factory Defaults?"
        message="This will restore all default fictional institutions (Sunrise International, Green Valley Junior College, Future Tech Engineering), reset administrator logins, and clear custom additions from your browser's localStorage."
        confirmLabel="Yes, Reset Everything"
        cancelLabel="Keep Current Data"
        variant="warning"
        onConfirm={() => {
          resetDemoData();
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};
