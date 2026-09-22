import React from 'react';
import { Loader2 } from 'lucide-react';
import { translateMessage } from '@/lib/i18n-utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  // Min-heights keep every size a valid touch target (WCAG 2.5.8 / 2.5.5).
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:translate-y-px';

  const sizeClasses = {
    sm: 'min-h-9 px-4 py-2 text-xs',
    md: 'min-h-11 px-5 py-2.5 text-sm',
    lg: 'min-h-12 px-7 py-3 text-base',
  };

  const variantClasses = {
    primary:
      'bg-primary text-on-primary shadow-sm shadow-primary/25 hover:bg-primary-dark hover:shadow-md hover:shadow-primary/30',
    ghost: 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]',
    destructive:
      'bg-[color-mix(in_srgb,var(--danger)_7%,transparent)] text-danger border border-[color-mix(in_srgb,var(--danger)_32%,transparent)] hover:bg-[color-mix(in_srgb,var(--danger)_14%,transparent)]',
    outline: 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-2)] hover:border-primary/40',
  };

  const renderChildren = (node: React.ReactNode): React.ReactNode =>
    React.Children.map(node, (child) => (typeof child === 'string' ? translateMessage(child) : child));

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : null}
      {renderChildren(children)}
    </button>
  );
}
