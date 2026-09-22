import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: React.ReactNode;
}

export default function Badge({
  variant = 'neutral',
  children,
  className = '',
  ...props
}: BadgeProps) {
  const baseClasses =
    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none border whitespace-nowrap';

  // Tint and hairline derive from the same semantic token as the label, so a
  // badge stays legible in both themes instead of relying on a fixed
  // dark-mode shade. Written out in full: Tailwind scans source for complete
  // class strings and cannot see names assembled at runtime.
  const variantClasses = {
    success:
      'bg-[color-mix(in_srgb,var(--success)_8%,transparent)] border-[color-mix(in_srgb,var(--success)_32%,transparent)] text-success',
    warning:
      'bg-[color-mix(in_srgb,var(--warning)_8%,transparent)] border-[color-mix(in_srgb,var(--warning)_32%,transparent)] text-warning',
    error:
      'bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] border-[color-mix(in_srgb,var(--danger)_32%,transparent)] text-danger',
    info: 'bg-[color-mix(in_srgb,var(--info)_8%,transparent)] border-[color-mix(in_srgb,var(--info)_32%,transparent)] text-info',
    neutral: 'bg-[var(--surface-2)] text-[var(--text)] border-[var(--border)]',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
