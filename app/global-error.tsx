'use client';

import { RotateCcw, TriangleAlert } from 'lucide-react';
import './globals.css';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg)] px-4 py-12 text-[var(--text)]">
          <div className="premium-grid absolute inset-0 opacity-70" />
          <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/18 to-transparent" />

          <section className="relative z-10 w-full max-w-xl rounded-[2rem] border border-white/10 bg-[var(--surface)]/82 p-6 text-center shadow-2xl shadow-cyan-950/15 backdrop-blur-2xl sm:p-8">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-[0_0_40px_rgba(18,169,217,0.24)]">
              <TriangleAlert size={30} />
            </div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-primary">Application Error</p>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl">
              Something went wrong
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[var(--text-muted)]">
              The app hit a root-level error. Try refreshing this screen to reload the interface.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(18,169,217,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(18,169,217,0.42)]"
            >
              <RotateCcw size={17} />
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
