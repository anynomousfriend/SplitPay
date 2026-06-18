/**
 * SplitPay — Base UI Components (Light Theme)
 * 
 * Clean, professional SaaS styled reusable components.
 */

'use client';

import { useState, useEffect, ReactNode } from 'react';

// ============================================
// Card — Clean white container
// ============================================
export function Card({
  title,
  children,
  className = '',
  noPadding = false,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-slate-200 shadow-sm
        transition-all duration-300
        ${noPadding ? '' : 'p-6 sm:p-8'}
        ${className}
      `}
    >
      {title && (
        <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2.5">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

// ============================================
// Input — Styled text input
// ============================================
export function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  icon,
  suffix,
  disabled = false,
  className = '',
}: {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon?: ReactNode;
  suffix?: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full bg-white border rounded-xl px-4 py-3 text-slate-900 text-sm
            placeholder-slate-400 transition-all duration-200 focus-ring
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${suffix ? 'pr-14' : ''}
            ${error ? 'border-red-300 focus:border-red-500' : 'border-slate-200 hover:border-slate-300 focus:border-slate-900'}
          `}
        />
        {suffix && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

// ============================================
// Button — Styled button with variants
// ============================================
export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}) {
  const variants = {
    primary: 'bg-slate-900 hover:bg-black text-white shadow-sm',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
  };

  const sizes = {
    sm: 'py-2 px-4 text-xs font-semibold rounded-lg',
    md: 'py-2.5 px-5 text-sm font-semibold rounded-xl',
    lg: 'py-3.5 px-6 text-base font-bold rounded-xl',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        transition-all duration-200
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        focus-ring
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// ============================================
// Alert — Status message
// ============================================
export function Alert({
  type,
  message,
  onClose,
}: {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
}) {
  const styles = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-800',
      iconText: 'text-emerald-600',
      icon: '✓',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      iconText: 'text-red-600',
      icon: '✕',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      iconText: 'text-blue-600',
      icon: 'ℹ',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-800',
      iconText: 'text-amber-600',
      icon: '⚠',
    },
  };

  const s = styles[type];

  return (
    <div className={`${s.bg} border rounded-xl px-4 py-3 flex items-start gap-3 animate-scale-in`}>
      <span className={`${s.iconText} text-lg flex-shrink-0 mt-0.5 font-bold`}>{s.icon}</span>
      <p className={`${s.text} text-sm font-medium flex-1`}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`${s.iconText} opacity-50 hover:opacity-100 transition-opacity flex-shrink-0`}
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ============================================
// EmptyState — Placeholder for empty content
// ============================================
export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-slate-900 text-lg font-bold mb-2">{title}</h3>
      <p className="text-slate-500 text-sm max-w-xs mx-auto">{description}</p>
    </div>
  );
}

// ============================================
// Modal — Overlay dialog
// ============================================
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`${sizes[size]} w-full bg-white rounded-2xl shadow-xl border border-slate-200 animate-scale-in`}>
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ============================================
// Badge — Small status label
// ============================================
export function Badge({
  children,
  variant = 'default',
}: {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}) {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <span className={`${variants[variant]} text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1`}>
      {children}
    </span>
  );
}

// ============================================
// Skeleton — Loading placeholder
// ============================================
export function Skeleton({
  className = '',
  variant = 'rect',
}: {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}) {
  const base = 'skeleton';
  const variants = {
    rect: '',
    circle: 'rounded-full',
    text: 'h-4 rounded',
  };

  return <div className={`${base} ${variants[variant]} ${className}`} />;
}

// ============================================
// LoadingSpinner — Animated spinner
// ============================================
export function LoadingSpinner({ size = 'md', color = 'white' }: { size?: 'sm' | 'md' | 'lg', color?: 'white' | 'primary' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-5 w-5 border-[3px]',
    lg: 'h-8 w-8 border-[3px]',
  };
  
  const colors = {
    white: 'border-white/80 border-r-transparent',
    primary: 'border-slate-900 border-r-transparent',
  }

  return (
    <div
      className={`${sizes[size]} ${colors[color]} animate-spin rounded-full border-solid`}
    />
  );
}

// ============================================
// IconButton
// ============================================
export function IconButton({
  children,
  onClick,
  tooltip,
  variant = 'ghost',
  className = '',
  disabled = false,
}: {
  children: ReactNode;
  onClick: () => void;
  tooltip?: string;
  variant?: 'ghost' | 'filled';
  className?: string;
  disabled?: boolean;
}) {
  const variants = {
    ghost: 'hover:bg-slate-100 text-slate-500 hover:text-slate-800',
    filled: 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900',
  };

  return (
    <button
      onClick={onClick}
      title={tooltip}
      disabled={disabled}
      className={`
        ${variants[variant]}
        w-9 h-9 flex items-center justify-center rounded-lg transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        focus-ring ${className}
      `}
    >
      {children}
    </button>
  );
}