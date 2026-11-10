import React from 'react';
import { Institution, InstitutionType } from '../../types';
import { formatNumber, formatCurrencyINR } from '../../utils/formatters';

interface TypeDistributionProps {
  institutions: Institution[];
}

export const TypeDistributionChart: React.FC<TypeDistributionProps> = ({ institutions }) => {
  const typeCounts: Record<InstitutionType, number> = {
    'School': 0,
    'Intermediate College': 0,
    'Degree College': 0,
    'Engineering College': 0,
    'Other': 0
  };

  institutions.forEach(i => {
    if (typeCounts[i.type] !== undefined) {
      typeCounts[i.type]++;
    } else {
      typeCounts['Other']++;
    }
  });

  const total = institutions.length || 1;

  const colorConfig: Record<InstitutionType, { bg: string; text: string; bar: string }> = {
    'School': { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500' },
    'Intermediate College': { bg: 'bg-teal-50', text: 'text-teal-700', bar: 'bg-teal-500' },
    'Degree College': { bg: 'bg-purple-50', text: 'text-purple-700', bar: 'bg-purple-500' },
    'Engineering College': { bg: 'bg-indigo-50', text: 'text-indigo-700', bar: 'bg-indigo-500' },
    'Other': { bg: 'bg-slate-50', text: 'text-slate-700', bar: 'bg-slate-500' }
  };

  const types = Object.keys(typeCounts) as InstitutionType[];

  return (
    <div className="space-y-4">
      {/* Visual Multi-Segment Progress Bar */}
      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
        {types.map(t => {
          const count = typeCounts[t];
          const pct = Math.round((count / total) * 100);
          if (pct === 0) return null;
          return (
            <div
              key={t}
              style={{ width: `${pct}%` }}
              className={`${colorConfig[t].bar} transition-all duration-500 relative group`}
              title={`${t}: ${count} (${pct}%)`}
            />
          );
        })}
      </div>

      {/* Legend & Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {types.map(t => {
          const count = typeCounts[t];
          const pct = Math.round((count / total) * 100);
          const cfg = colorConfig[t];

          return (
            <div key={t} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full ${cfg.bar}`} />
                <span className="text-xs font-medium text-slate-700">{t}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{count}</span>
                <span className="text-xs text-slate-400">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface GrowthBarChartProps {
  institutions: Institution[];
}

export const GrowthBarChart: React.FC<GrowthBarChartProps> = ({ institutions }) => {
  // Monthly registration activity
  const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  
  // Fictional monthly weightings adjusted with real total
  const total = institutions.length;
  const data = [
    { month: 'Jun', count: Math.max(1, Math.round(total * 0.15)), students: 850 },
    { month: 'Jul', count: Math.max(1, Math.round(total * 0.2)), students: 1200 },
    { month: 'Aug', count: Math.max(1, Math.round(total * 0.25)), students: 1650 },
    { month: 'Sep', count: Math.max(1, Math.round(total * 0.18)), students: 950 },
    { month: 'Oct', count: Math.max(1, Math.round(total * 0.22)), students: 1400 },
    { month: 'Nov (Current)', count: Math.max(total, 5), students: institutions.reduce((s, i) => s + i.studentCount, 0) },
  ];

  const maxVal = Math.max(...data.map(d => d.count), 6);

  return (
    <div className="space-y-4">
      <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
        {data.map((item, idx) => {
          const heightPct = Math.round((item.count / maxVal) * 85) + 15;
          const isCurrent = idx === data.length - 1;

          return (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div className="text-xs font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.count} inst.
              </div>
              <div 
                style={{ height: `${heightPct}%` }}
                className={`w-full max-w-[42px] rounded-t-lg transition-all duration-500 relative ${
                  isCurrent 
                    ? 'bg-gradient-to-t from-teal-700 to-teal-500 shadow-md shadow-teal-500/20' 
                    : 'bg-slate-200 group-hover:bg-slate-300'
                }`}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {formatNumber(item.students)} students
                </div>
              </div>
              <span className={`text-[11px] truncate text-center ${isCurrent ? 'font-bold text-teal-700' : 'text-slate-500'}`}>
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span>Campuses onboarded per month</span>
        <span className="font-semibold text-teal-700">Total active network: {institutions.length} campuses</span>
      </div>
    </div>
  );
};

interface RevenueBreakdownProps {
  institutions: Institution[];
}

export const RevenueBreakdownChart: React.FC<RevenueBreakdownProps> = ({ institutions }) => {
  const tiers = ['Starter', 'Standard', 'Premium', 'Enterprise'] as const;
  
  const tierRevenue: Record<string, { count: number; revenue: number }> = {
    Starter: { count: 0, revenue: 0 },
    Standard: { count: 0, revenue: 0 },
    Premium: { count: 0, revenue: 0 },
    Enterprise: { count: 0, revenue: 0 },
  };

  institutions.forEach(i => {
    if (tierRevenue[i.subscriptionPlan]) {
      tierRevenue[i.subscriptionPlan].count++;
      tierRevenue[i.subscriptionPlan].revenue += i.annualAmount || 0;
    }
  });

  const totalRev = institutions.reduce((s, i) => s + (i.annualAmount || 0), 0) || 1;

  const tierColors: Record<string, string> = {
    Starter: 'bg-blue-500',
    Standard: 'bg-teal-500',
    Premium: 'bg-purple-500',
    Enterprise: 'bg-amber-500'
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {tiers.map(t => {
          const item = tierRevenue[t];
          const pct = Math.round((item.revenue / totalRev) * 100);

          return (
            <div key={t} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${tierColors[t]}`} />
                  {t} Plan ({item.count} campuses)
                </span>
                <span className="font-bold text-slate-900">{formatCurrencyINR(item.revenue)}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${pct}%` }}
                  className={`h-full ${tierColors[t]} rounded-full transition-all duration-500`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-600">Annual Contracted Value (ARR)</span>
        <span className="text-sm font-bold text-teal-800">{formatCurrencyINR(totalRev)}</span>
      </div>
    </div>
  );
};
