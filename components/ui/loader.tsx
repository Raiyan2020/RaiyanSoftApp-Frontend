import React from 'react';
import { Loader2 } from 'lucide-react';
import { translateMessage } from '@/lib/i18n-utils';

interface LoaderProps {
  size?: number;
  fullScreen?: boolean;
  className?: string;
  /** Announced to assistive tech; defaults to a generic "Loading...". */
  label?: string;
}

export default function Loader({ size = 24, fullScreen = false, className = '', label = 'Loading...' }: LoaderProps) {
  // The spinner is decorative on its own: without a live region a screen
  // reader reported nothing at all while any of these views were fetching.
  const announcement = (
    <span className="sr-only">{translateMessage(label)}</span>
  );

  if (fullScreen) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)]/80 backdrop-blur-sm"
      >
        <Loader2 aria-hidden="true" className={`animate-spin text-primary ${className}`} size={size} />
        {announcement}
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" className={`flex items-center justify-center p-4 ${className}`}>
      <Loader2 aria-hidden="true" className="animate-spin text-primary" size={size} />
      {announcement}
    </div>
  );
}
