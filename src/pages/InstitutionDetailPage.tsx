import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Institution, SubscriptionTier } from '../types';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  GraduationCap, 
  Briefcase, 
  Layers, 
  Activity, 
  CreditCard, 
  ShieldCheck, 
  Edit3, 
  Trash2, 
  ArrowLeft,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { formatCurrencyINR, formatNumber, formatDate, getDaysRemaining } from '../utils/formatters';

interface InstitutionDetailPageProps {
  institutionId: string;
  onBack: () => void;
  onEdit: (institution: Institution) => void;
}

export const InstitutionDetailPage: React.FC<InstitutionDetailPageProps> = ({
  institutionId,
  onBack,
  onEdit
}) => {
  const { institutions, administrators, deleteInstitution, toggleInstitutionStatus, assignSubscriptionPlan } = useData();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const institution = institutions.find(i => i.id === institutionId);

  if (!institution) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Institution Not Found</h3>
        <p className="text-sm text-slate-500">The institution with ID {institutionId} does not exist or was deleted.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </button>
      </div>
    );
  }

  // Linked administrator
  const linkedAdmin = administrators.find(a => a.institutionId === institution.id) || {
    name: institution.adminName,
    email: institution.adminEmail,
    phone: institution.adminPhone,
    role: 'Primary Administrator',
    status: 'Active',
    lastLogin: 'Recent'
  };

  const daysRemaining = getDaysRemaining(institution.subscriptionExpiryDate);
  const capacityPct = Math.round(((institution.studentCount || 0) / institution.studentCapacity) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Navigation & Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => toggleInstitutionStatus(institution.id)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              institution.status === 'Active'
                ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {institution.status === 'Active' ? 'Deactivate Campus' : 'Activate Campus'}
          </button>

          <button
            onClick={() => onEdit(institution)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* Hero Cover & Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Cover Photo */}
        <div className="h-44 sm:h-56 w-full relative bg-slate-800 overflow-hidden">
          <img
            src={institution.coverImage}
            alt={institution.name}
            className="w-full h-full object-cover opacity-85"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur-md border border-slate-700">
              ID: {institution.id}
            </span>
            <Badge variant={institution.status === 'Active' ? 'success' : 'neutral'} dot size="md">
              {institution.status}
            </Badge>
          </div>
        </div>

        {/* Profile Details Bar */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            <div className="flex items-end gap-4">
              <img
                src={institution.logo}
                alt={institution.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-xl bg-white shrink-0"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&auto=format&fit=crop&q=80';
                }}
              />
              <div className="pb-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {institution.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                  <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {institution.type}
                  </span>
                  <span>•</span>
                  <span>Est. {institution.establishedYear}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {institution.city}, {institution.state}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge variant={institution.subscriptionPlan === 'Enterprise' ? 'enterprise' : institution.subscriptionPlan === 'Premium' ? 'premium' : 'standard'} size="lg">
                {institution.subscriptionPlan} Plan
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Quick Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Total Students</span>
            <GraduationCap className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {formatNumber(institution.studentCount)}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Quota: {formatNumber(institution.studentCapacity)}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Campus Faculty</span>
            <Briefcase className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {institution.staffCount || 28}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Full-time teaching & admin</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Active Classes</span>
            <Layers className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {institution.classesCount || 16}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Batches / sections</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Avg Attendance</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700">
            94.8%
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Sample monthly index</p>
        </div>
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Campus Profile & Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Institutional Contact Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
              Campus Profile & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 font-medium">Principal / Campus Dean</span>
                <p className="text-sm font-bold text-slate-900">{institution.principalName}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 font-medium">Official Contact Email</span>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  {institution.email}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 font-medium">Official Phone</span>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  +91 {institution.phone}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 font-medium">Registered Address</span>
                <p className="text-sm font-bold text-slate-900">
                  {institution.address ? `${institution.address}, ` : ''}{institution.city}, {institution.state} {institution.postalCode}
                </p>
              </div>
            </div>
          </div>

          {/* Assigned Administrator Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
                Designated Campus Administrator
              </h3>
              <Badge variant="success" size="sm" dot>
                {linkedAdmin.status || 'Active'}
              </Badge>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-lg shrink-0">
                {linkedAdmin.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900">{linkedAdmin.name}</h4>
                <p className="text-xs text-slate-500">{linkedAdmin.role || 'Primary Campus Admin'}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {linkedAdmin.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    +91 {linkedAdmin.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Subscription & Quota Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
                SaaS Subscription
              </h3>
              <Badge variant={institution.subscriptionStatus === 'Active' ? 'success' : 'warning'} size="sm">
                {institution.subscriptionStatus}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl">
                <span className="text-xs text-teal-800 font-semibold block">Active Plan Tier</span>
                <span className="text-xl font-black text-teal-950 block mt-0.5">
                  {institution.subscriptionPlan} Plan
                </span>
                <span className="text-xs text-teal-700 font-medium">
                  {formatCurrencyINR(institution.annualAmount)} / year
                </span>
              </div>

              {/* Student Capacity Meter */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Student Capacity Quota</span>
                  <span className="font-bold text-slate-900">{capacityPct}% utilized</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, capacityPct)}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      capacityPct > 90 ? 'bg-amber-500' : 'bg-teal-600'
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Enrolled: {formatNumber(institution.studentCount)}</span>
                  <span>Limit: {formatNumber(institution.studentCapacity)}</span>
                </div>
              </div>

              {/* Expiry & Days Remaining */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">License Start:</span>
                  <span className="font-semibold text-slate-800">{formatDate(institution.subscriptionStartDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">License Expiry:</span>
                  <span className="font-semibold text-slate-800">{formatDate(institution.subscriptionExpiryDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Days to Renewal:</span>
                  <span className={`font-bold ${daysRemaining < 30 ? 'text-amber-600' : 'text-emerald-700'}`}>
                    {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expired'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full py-2 px-3 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors text-center cursor-pointer"
            >
              Modify Plan or Pricing
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title={`Delete Campus "${institution.name}"?`}
        message={`Are you sure you want to delete ${institution.name} (${institution.id})? In accordance with your architectural guidelines, this ID will NEVER be reused for future institutions.`}
        confirmLabel="Yes, Delete Permanently"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => {
          deleteInstitution(institution.id);
          setShowDeleteConfirm(false);
          onBack();
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Quick Upgrade/Change Plan Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setShowUpgradeModal(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Change Subscription Tier</h3>
              <p className="text-xs text-slate-500">
                Assign a new plan to {institution.name}. Annual fees and limits will update automatically.
              </p>

              <div className="space-y-2">
                {(['Starter', 'Standard', 'Premium', 'Enterprise'] as SubscriptionTier[]).map(tier => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => {
                      assignSubscriptionPlan(institution.id, tier);
                      setShowUpgradeModal(false);
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                      institution.subscriptionPlan === tier
                        ? 'border-teal-500 bg-teal-50/60 font-bold'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{tier} Plan</span>
                      <span className="text-[11px] text-slate-500">
                        {tier === 'Starter' ? 'Up to 300 students — ₹24,999/yr' :
                         tier === 'Standard' ? '301–800 students — ₹49,999/yr' :
                         tier === 'Premium' ? '801–1,500 students — ₹79,999/yr' :
                         '1,501–2,500+ students — ₹1,19,999/yr'}
                      </span>
                    </div>
                    {institution.subscriptionPlan === tier && (
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
