'use client';

import { useEffect } from 'react';
import { RotateCcw, TriangleAlert } from 'lucide-react';
import AppStateScreen from '@/components/layout/app-state-screen';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App route error:', error);
  }, [error]);

  return (
    <AppStateScreen
      eyebrow="Something went wrong"
      title="We could not load this page"
      description="A temporary issue stopped this page from rendering. Try again, or return to the homepage and continue from there."
      icon={<TriangleAlert size={30} />}
      primaryAction={{ href: '/', label: 'Go home' }}
      secondaryAction={
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-5 py-3 text-sm font-bold text-[var(--text)] transition-all hover:-translate-y-0.5 hover:bg-[var(--surface)]"
        >
          <RotateCcw size={17} />
          Try again
        </button>
      }
    />
  );
}
