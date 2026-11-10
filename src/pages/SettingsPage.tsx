import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Settings, 
  RotateCcw, 
  ShieldAlert, 
  Building2, 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin, 
  Check, 
  Save,
  Server,
  Database,
  Lock,
  Layers
} from 'lucide-react';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const SettingsPage: React.FC = () => {
  const { resetDemoData } = useData();
  const { user } = useAuth();

  const [companyName, setCompanyName] = useState('L.Tech Solutions');
  const [platformName, setPlatformName] = useState('EduNexa');
  const [tagline, setTagline] = useState('One Platform. Every Campus. Connected Education.');
  const [supportEmail, setSupportEmail] = useState('support@ltechsolutions.in');
  const [supportPhone, setSupportPhone] = useState('+91 98490 54321');
  const [officeAddress, setOfficeAddress] = useState('Tech Zone, Cyber Hills, Madhapur, Hyderabad, Telangana 500081');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150 max-w-4xl">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-teal-600" />
          Platform Settings & System Overview
        </h2>
        <p className="text-xs text-slate-500">
          Configure branding, support touchpoints, and browser storage persistence.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Settings updated successfully for this session.
        </div>
      )}

      {/* Company & Platform Branding */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Developer & Platform Branding</h3>
            <p className="text-xs text-slate-500">White-label vendor information & brand identity</p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Parent Development Company
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                SaaS Product Brand Name
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Official Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Helpline Phone
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Registered Head Office
            </label>
            <input
              type="text"
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              Save Branding Preferences
            </button>
          </div>
        </form>
      </div>

      {/* Demo Credentials & Architecture Transparency */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Demo Account & Security Model</h3>
            <p className="text-xs text-slate-500">Super Admin demonstration credentials</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Super Admin Demo Email:</span>
            <span className="font-mono font-bold text-slate-900">superadmin@edunexa.demo</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Demo Password:</span>
            <span className="font-mono font-bold text-slate-900">Demo@123</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Session Role:</span>
            <span className="font-bold text-teal-700">{user?.role || 'Global Platform Admin'}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Backend Connection:</span>
            <span className="font-semibold text-slate-600">Frontend Prototype Mode (No external DB)</span>
          </div>
        </div>

        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Architecture Notice:</strong> In this Phase 1 prototype, data is stored in the browser's <code className="bg-amber-100/70 px-1 rounded font-mono">localStorage</code> with schema versioning. This demo does not claim production multi-tenant data isolation or banking-grade security. A central PostgreSQL database and secured JWT microservices will be integrated in Phase 2.
          </div>
        </div>
      </div>

      {/* Demo Data Reset Section */}
      <div className="bg-white rounded-2xl border border-rose-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-rose-100">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Restore Factory Demo Data</h3>
            <p className="text-xs text-slate-500">Reset localStorage back to initial fictional institutions</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          If you have added test institutions, deleted records, or modified subscriptions and wish to return to the original clean demonstration state with Sunrise International School, Green Valley Junior College, and Future Tech Engineering College, use this reset action.
        </p>

        <div className="pt-2">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo Data to Initial State
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset All Demo Data?"
        message="This action will clear custom institutions and restore factory sample records in your browser. ID sequences will also be reset to start from the highest initial record."
        confirmLabel="Yes, Reset Factory Data"
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={() => {
          resetDemoData();
          setShowResetConfirm(false);
          setSavedSuccess(true);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};
