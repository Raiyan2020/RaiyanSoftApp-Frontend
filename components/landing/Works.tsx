'use client';
import { useRef } from 'react';
import { useSectionReveal } from './use-section-reveal';
import { useLandingContent } from '@/features/landing/hooks/use-landing-content';

const workGradients = [
  'from-sky-500 to-cyan-500',
  'from-primary to-emerald-400',
  'from-emerald-500 to-teal-500',
  'from-amber-400 to-orange-500',
];

export default function Works() {
  const ref = useRef<HTMLDivElement>(null);
  useSectionReveal(ref);
  const { content, dir, textAlign } = useLandingContent();
  const { works } = content;

  return (
    <section id="works" className="relative overflow-hidden bg-slate-50 py-12 dark:bg-navy-900 sm:py-16 lg:py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="pointer-events-none absolute -right-32 top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`reveal mb-10 flex flex-col gap-4 text-center lg:mb-12 lg:flex-row lg:items-end lg:justify-between ${textAlign}`}>
          <div className="space-y-4">
            <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              {works.badge}
            </div>
            <h2 className="text-2xl font-bold leading-[1.34] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.35rem]">
              {works.title} <span className="gradient-text">{works.titleHighlight}</span>
            </h2>
          </div>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg lg:mx-0">
            {works.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 lg:gap-6">
          {works.items.map((work, i) => (
            <article
              key={work.id}
              id={`work-${work.id}`}
              className="reveal group overflow-hidden rounded-[1.75rem] border border-cyan-950/10 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-glow)] dark:border-white/10 dark:bg-white/5 lg:rounded-[2rem]"
              style={{ transitionDelay: `${i * 0.07}s` }}
            >
              <div className={`relative flex h-36 items-end overflow-hidden bg-gradient-to-br ${workGradients[i % workGradients.length]} p-6 sm:h-40`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_45%)]" />
                <span className="relative rounded-full bg-slate-950/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur ring-1 ring-white/10">
                  {work.category}
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <h3 className="mb-2 text-lg font-bold text-slate-950 transition-colors duration-300 group-hover:text-primary dark:text-white sm:text-xl">
                  {work.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:min-h-12">{work.desc}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {work.stats.map((stat) => (
                    <span key={stat} className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                      {stat}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-800 transition-all duration-300 hover:gap-4 hover:text-primary dark:text-slate-200"
                >
                  {works.discussCta}
                  <svg className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="reveal mt-8 rounded-[2rem] border border-cyan-950/10 bg-white p-5 text-center shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8 lg:mt-12">
          <h3 className="text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">{works.ctaTitle}</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            {works.ctaDescription}
          </p>
          <button
            type="button"
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="premium-button touch-lift mt-5 rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:-translate-y-1 sm:mt-6 sm:px-8 sm:py-4 sm:text-lg"
          >
            {works.ctaButton}
          </button>
        </div>
      </div>
    </section>
  );
}
