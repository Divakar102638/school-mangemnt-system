import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 
    | 'success' 
    | 'warning' 
    | 'danger' 
    | 'info' 
    | 'teal' 
    | 'navy' 
    | 'neutral' 
    | 'purple'
    | 'starter'
    | 'standard'
    | 'premium'
    | 'enterprise';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral', 
  size = 'md',
  dot = false 
}) => {
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/60',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/60',
    info: 'bg-sky-50 text-sky-700 border-sky-200/60',
    teal: 'bg-teal-50 text-teal-700 border-teal-200/60',
    navy: 'bg-slate-100 text-slate-800 border-slate-300',
    neutral: 'bg-slate-50 text-slate-600 border-slate-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/60',
    starter: 'bg-blue-50 text-blue-700 border-blue-200',
    standard: 'bg-teal-50 text-teal-700 border-teal-200',
    premium: 'bg-purple-50 text-purple-700 border-purple-200',
    enterprise: 'bg-amber-50 text-amber-800 border-amber-300',
  };

  const dotColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    teal: 'bg-teal-500',
    navy: 'bg-slate-700',
    neutral: 'bg-slate-400',
    purple: 'bg-purple-500',
    starter: 'bg-blue-500',
    standard: 'bg-teal-500',
    premium: 'bg-purple-500',
    enterprise: 'bg-amber-500',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-medium px-2.5 py-1',
    lg: 'text-sm font-medium px-3 py-1.5'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} transition-colors`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
};
