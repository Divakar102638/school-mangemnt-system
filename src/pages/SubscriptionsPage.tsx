import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { SubscriptionTier, Institution } from '../types';
import { 
  CreditCard, 
  Check, 
  Sparkles, 
  Building2, 
  ArrowUpRight, 
  Calendar, 
  Clock, 
  IndianRupee,
  ShieldCheck,
  Edit2
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { formatCurrencyINR, formatNumber, formatDate, getDaysRemaining } from '../utils/formatters';

export const SubscriptionsPage: React.FC = () => {
  const { institutions, subscriptionPlans, assignSubscriptionPlan } = useData();

  const [selectedPlanForAssign, setSelectedPlanForAssign] = useState<SubscriptionTier | null>(null);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>(institutions[0]?.id || '');
  const [customPrice, setCustomPrice] = useState<number>(49999);

  // Quick assign modal
  const openAssignModal = (planId: SubscriptionTier) => {
    setSelectedPlanForAssign(planId);
    const plan = subscriptionPlans.find(p => p.id === planId);
    setCustomPrice(plan ? plan.pricePerYear : 49999);
    setSelectedInstitutionId(institutions[0]?.id || '');
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForAssign || !selectedInstitutionId) return;

    assignSubscriptionPlan(selectedInstitutionId, selectedPlanForAssign, customPrice);
    setSelectedPlanForAssign(null);
  };

  const totalARR = institutions.reduce((sum, i) => sum + (i.annualAmount || 0), 0);
  const avgLicense = institutions.length > 0 ? Math.round(totalARR / institutions.length) : 0;
  const activeSubsCount = institutions.filter(i => i.subscriptionStatus === 'Active').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-600" />
            Subscription Plans & SaaS Licensing
          </h2>
          <p className="text-xs text-slate-500">
            Tiered multi-campus licensing models with annual contracted values and quota limits.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="text-slate-500">Annual Run-Rate:</span>
          <span className="text-teal-700 font-bold">{formatCurrencyINR(totalARR)}</span>
        </div>
      </div>

      {/* Revenue Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold uppercase text-slate-500">Total Contracted ARR</p>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatCurrencyINR(totalARR)}</div>
          <p className="text-xs text-emerald-600 mt-1">100% renewal tracking</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold uppercase text-slate-500">Active Subscriptions</p>
          <div className="text-2xl font-black text-teal-700 mt-1">{activeSubsCount} / {institutions.length}</div>
          <p className="text-xs text-slate-500 mt-1">Licensed campus deployments</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold uppercase text-slate-500">Average Annual Revenue / Campus</p>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatCurrencyINR(avgLicense)}</div>
          <p className="text-xs text-slate-500 mt-1">Weighted across 4 tiers</p>
        </div>
      </div>

      {/* 4 Tiered Plans Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subscriptionPlans.map(plan => {
          const enrolledCampuses = institutions.filter(i => i.subscriptionPlan === plan.id);

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all duration-200 relative ${
                plan.popular
                  ? 'border-teal-500 shadow-lg shadow-teal-500/10 ring-2 ring-teal-500/20'
                  : 'border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{plan.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-2xl font-black text-slate-900">
                    {formatCurrencyINR(plan.pricePerYear)}
                    <span className="text-xs font-normal text-slate-500"> / year</span>
                  </div>
                  <div className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md inline-block mt-1">
                    {plan.studentLimitRange}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Features Included:</p>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Assign Button & Stats */}
              <div className="pt-6 border-t border-slate-100 mt-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Assigned Campuses:</span>
                  <strong className="text-slate-900 font-bold">{enrolledCampuses.length}</strong>
                </div>

                <button
                  onClick={() => openAssignModal(plan.id)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    plan.popular
                      ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>Assign to Campus</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Institution Subscriptions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Campus Subscription Roster</h3>
            <p className="text-xs text-slate-500">Live license status, renewal deadlines, and capacity</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Campus</th>
                <th className="py-3 px-4">Current Plan</th>
                <th className="py-3 px-4">Annual Fee</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Days Left</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {institutions.map(inst => {
                const daysLeft = getDaysRemaining(inst.subscriptionExpiryDate);

                return (
                  <tr key={inst.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{inst.name}</div>
                      <span className="font-mono text-[10px] text-slate-400">ID: {inst.id}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={inst.subscriptionPlan === 'Enterprise' ? 'enterprise' : inst.subscriptionPlan === 'Premium' ? 'premium' : 'standard'} size="sm">
                        {inst.subscriptionPlan}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatCurrencyINR(inst.annualAmount)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {formatDate(inst.subscriptionStartDate)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {formatDate(inst.subscriptionExpiryDate)}
                    </td>

                    <td className="py-3.5 px-4 font-semibold">
                      <span className={daysLeft < 30 ? 'text-amber-600' : 'text-emerald-700'}>
                        {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Badge variant={inst.subscriptionStatus === 'Active' ? 'success' : 'warning'} size="sm" dot>
                        {inst.subscriptionStatus}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Plan Modal */}
      {selectedPlanForAssign && (
        <Modal
          isOpen={!!selectedPlanForAssign}
          onClose={() => setSelectedPlanForAssign(null)}
          title={`Assign ${selectedPlanForAssign} Plan`}
          subtitle="Select target institution campus and customize annual billing fee."
          maxWidth="md"
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Campus *
              </label>
              <select
                value={selectedInstitutionId}
                onChange={(e) => setSelectedInstitutionId(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.id}) — Currently {inst.subscriptionPlan}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Annual Fee (INR ₹)
              </label>
              <input
                type="number"
                min="0"
                value={customPrice}
                onChange={(e) => setCustomPrice(Number(e.target.value))}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Default suggested rate for {selectedPlanForAssign} tier.
              </span>
            </div>

            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs text-teal-800">
              Assigning this plan will reset the renewal cycle to 1 full year from today and update the campus quota limit.
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlanForAssign(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
              >
                Confirm Plan Assignment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
