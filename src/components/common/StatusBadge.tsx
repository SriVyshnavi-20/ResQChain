import React from 'react';

export type BadgeVariant = 'emergency' | 'resolved' | 'warning' | 'info' | 'neutral';

export interface StatusBadgeProps {
  variant?: BadgeVariant;
  label: string;
  dot?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant = 'neutral',
  label,
  dot = true,
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    emergency: 'bg-red-100 text-red-800 border-red-200',
    resolved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-900 border-amber-200',
    info: 'bg-sky-100 text-sky-800 border-sky-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const dotStyles = {
    emergency: 'bg-red-500 animate-pulse',
    resolved: 'bg-emerald-500',
    warning: 'bg-amber-500',
    info: 'bg-sky-500',
    neutral: 'bg-slate-400',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[variant]}`} />}
      <span>{label}</span>
    </span>
  );
};
