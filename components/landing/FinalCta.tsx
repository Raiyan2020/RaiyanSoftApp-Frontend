'use client';
import { useLandingContent } from '@/features/landing/hooks/use-landing-content';

export default function FinalCta() {
  const { content } = useLandingContent();
  const { finalCta } = content;

  return (
    <section aria-labelledby="final-cta-title" className="relative overflow-hidden bg-white px-4 py-10 dark:bg-navy-950 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 text-center text-white shadow-2xl shadow-cyan-950/20 sm:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(18,169,217,0.24),transparent_36%)]" />
        <div className="relative">
          <p className="mb-4 text-sm font-bold text-primary">{finalCta.badge}</p>
          <h2 id="final-cta-title" className="mx-auto max-w-3xl text-2xl font-bold leading-[1.34] sm:text-3xl lg:text-[2.35rem]">
            {finalCta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">{finalCta.description}</p>
          <button
            type="button"
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="premium-button touch-lift mt-8 rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-8 py-4 text-lg font-bold text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:-translate-y-1"
          >
            {finalCta.button}
          </button>
        </div>
      </div>
    </section>
  );
}
