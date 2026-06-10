import React from 'react';
import { translateMessage } from '@/lib/i18n-utils';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  subtitle,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 app-surface-muted rounded-2xl ${className}`}>
      <div className="w-16 h-16 bg-[var(--surface)] rounded-full flex items-center justify-center mb-4 border border-[var(--border)] text-[var(--text-muted)]">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[var(--text)] mb-1">{translateMessage(title)}</h3>
      {subtitle ? (
        <p className="text-[var(--text-muted)] text-sm max-w-xs mb-6">{translateMessage(subtitle)}</p>
      ) : null}
      {action ? <div>{action}</div> : null}
    </div>
  );
}
