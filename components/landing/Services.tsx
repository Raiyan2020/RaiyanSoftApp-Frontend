'use client';
import { useRef } from 'react';
import { useSectionReveal } from './use-section-reveal';
import { useLandingContent } from '@/features/landing/hooks/use-landing-content';

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  useSectionReveal(ref);
  const { content, textAlign } = useLandingContent();
  const { services } = content;

  return (
    <section id="services" className="relative overflow-hidden bg-white py-16 dark:bg-navy-950 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(18,169,217,0.12),transparent_34%),linear-gradient(to_bottom,#ffffff,rgba(247,251,253,0.82))] dark:bg-[radial-gradient(circle_at_top_right,rgba(18,169,217,0.12),transparent_32%),linear-gradient(to_bottom,#020617,#071827)]" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`reveal mb-10 grid gap-4 lg:mb-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end`}>
          <div className={`space-y-4 ${textAlign}`}>
            <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              {services.badge}
            </div>
            <h2 className="text-2xl font-bold leading-[1.34] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.35rem]">
              {services.title} <span className="gradient-text">{services.titleHighlight}</span>
            </h2>
          </div>
          <p className={`mx-auto max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg lg:mx-0 ${textAlign}`}>
            {services.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
          {services.items.map((service, i) => (
            <article
              key={service.id}
              id={`service-${service.id}`}
              className="reveal group relative overflow-hidden rounded-[1.75rem] border border-cyan-950/10 bg-white p-5 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[var(--shadow-glow)] dark:border-white/10 dark:bg-white/5 sm:p-7 lg:rounded-[2rem] lg:p-8"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className={`absolute -left-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${service.gradient} opacity-15 blur-2xl transition-opacity duration-500 group-hover:opacity-25`} />
              <div className="relative z-10 flex h-full flex-col gap-4 sm:gap-6 lg:gap-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-3 text-sm font-bold text-primary">{service.eyebrow}</p>
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">{service.title}</h3>
                  </div>
                  <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${service.gradient} text-xs font-black text-white shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16 sm:text-sm`}>
                    {service.metric}
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">{service.description}</p>

                <div className="hidden rounded-3xl border border-cyan-950/10 bg-slate-50/80 p-4 text-sm font-semibold leading-relaxed text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 sm:block">
                  {service.outcome}
                </div>

                <div className="mt-auto flex flex-wrap gap-2">
                  {service.points.map((point) => (
                    <span key={point} className="rounded-full border border-cyan-950/10 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
