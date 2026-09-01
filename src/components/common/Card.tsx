import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  bordered?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'alert-emergency' | 'alert-warning' | 'alert-info' | 'highlight';
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  bordered = true,
  padding = 'md',
  variant = 'default',
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const variantStyles = {
    default: 'bg-white text-slate-800 shadow-subtle',
    elevated: 'bg-white text-slate-800 shadow-card',
    'alert-emergency': 'bg-red-50/70 border-red-200 text-slate-900',
    'alert-warning': 'bg-amber-50/70 border-amber-200 text-slate-900',
    'alert-info': 'bg-sky-50/70 border-sky-200 text-slate-900',
    highlight: 'bg-gradient-to-br from-white to-blue-50/50 border-blue-200 text-slate-900 shadow-sm',
  };

  const borderStyle = bordered ? 'border border-slate-200/90' : '';
  const hoverStyle = hoverable ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer' : '';

  return (
    <div
      className={`rounded-xl ${variantStyles[variant]} ${borderStyle} ${paddingStyles[padding]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
