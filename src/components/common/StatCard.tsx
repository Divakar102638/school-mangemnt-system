import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  colorTheme?: 'teal' | 'navy' | 'blue' | 'purple' | 'amber' | 'emerald';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  change,
  isPositive = true,
  colorTheme = 'teal',
  onClick
}) => {
  const colorMap = {
    teal: {
      bg: 'bg-teal-50',
      iconText: 'text-teal-600',
      border: 'hover:border-teal-300',
    },
    navy: {
      bg: 'bg-slate-100',
      iconText: 'text-slate-800',
      border: 'hover:border-slate-400',
    },
    blue: {
      bg: 'bg-blue-50',
      iconText: 'text-blue-600',
      border: 'hover:border-blue-300',
    },
    purple: {
      bg: 'bg-purple-50',
      iconText: 'text-purple-600',
      border: 'hover:border-purple-300',
    },
    amber: {
      bg: 'bg-amber-50',
      iconText: 'text-amber-600',
      border: 'hover:border-amber-300',
    },
    emerald: {
      bg: 'bg-emerald-50',
      iconText: 'text-emerald-600',
      border: 'hover:border-emerald-300',
    }
  };

  const currentTheme = colorMap[colorTheme];

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${currentTheme.border}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
        </div>
        <div className={`p-2.5 rounded-lg ${currentTheme.bg}`}>
          <Icon className={`w-5 h-5 ${currentTheme.iconText}`} />
        </div>
      </div>

      {(subtitle || change) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {change && (
            <span className={`inline-flex items-center font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isPositive ? '↑' : '↓'} {change}
            </span>
          )}
          {subtitle && (
            <span className="text-slate-500 truncate">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};
