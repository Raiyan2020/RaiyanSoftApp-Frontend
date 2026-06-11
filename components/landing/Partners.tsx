'use client';
import { useRef } from 'react';
import { useSectionReveal } from './use-section-reveal';
import { useLandingContent } from '@/features/landing/hooks/use-landing-content';
import { useLandingTestimonials } from '@/features/landing-page';
import SafeImage from '@/components/ui/safe-image';

export default function Partners() {
  const ref = useRef<HTMLDivElement>(null);
  useSectionReveal(ref);
  const { content, textAlign } = useLandingContent();
  const { partners } = content;
  const { data: apiData } = useLandingTestimonials();

  const badge = apiData?.header?.caption || partners.badge;
  const title = apiData?.header?.title || `${partners.title} ${partners.titleHighlight}`;
  const description = apiData?.header?.description || partners.description;
  const hasApiTestimonials = (apiData?.testimonials?.length ?? 0) > 0;

  return (
    <section id="partners" className="relative overflow-hidden bg-white py-12 dark:bg-navy-950 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(33,211,162,0.14),transparent_34%)]" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`reveal mb-10 text-center lg:mb-12 ${textAlign}`}>
          <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            {badge}
          </div>
          <h2 className="text-2xl font-bold leading-[1.34] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.35rem]">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            {description}
          </p>
        </div>

        {/* Static trust cards — shown only when no API testimonials yet */}
        {!hasApiTestimonials ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {partners.trustCards.map((card, i) => (
              <article
                key={card.title}
                className="reveal rounded-[2rem] border border-cyan-950/10 bg-slate-50/80 p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:bg-white hover:shadow-[var(--shadow-glow)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/8"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-lg font-black text-white shadow-lg shadow-primary/20">
                  {card.stat}
                </div>
                <h3 className="mb-3 text-2xl font-bold text-slate-950 dark:text-white">{card.title}</h3>
                <p className="leading-relaxed text-slate-600 dark:text-slate-300">{card.body}</p>
              </article>
            ))}
          </div>
        ) : null}

        {/* Testimonials grid */}
        <div className={`${hasApiTestimonials ? '' : 'mt-8'} grid gap-6 ${hasApiTestimonials ? 'grid-cols-1 sm:grid-cols-2' : 'lg:grid-cols-2'}`}>
          {hasApiTestimonials
            ? apiData!.testimonials.map((testimonial, i) => (
                <article
                  key={testimonial.id}
                  className="reveal rounded-[2rem] border border-cyan-950/10 bg-slate-950 p-6 text-white shadow-2xl shadow-cyan-950/10 dark:border-white/15 dark:bg-white/8"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <p className="text-3xl font-black text-primary">"</p>
                  <blockquote className="mt-2 text-lg font-semibold leading-relaxed">{testimonial.description}</blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    {testimonial.image ? (
                      <SafeImage src={testimonial.image} alt={testimonial.title} className="h-11 w-11 rounded-2xl" />
                    ) : (
                      <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary to-emerald-400" />
                    )}
                    <div>
                      <p className="font-bold">{testimonial.title}</p>
                      <p className="text-sm text-slate-400">{testimonial.caption}</p>
                    </div>
                  </div>
                </article>
              ))
            : partners.highlights.map((item, i) => (
                <article
                  key={`${item.name}-${item.company}`}
                  className="reveal rounded-[2rem] border border-cyan-950/10 bg-slate-950 p-6 text-white shadow-2xl shadow-cyan-950/10 dark:border-white/15 dark:bg-white/8"
                  style={{ transitionDelay: `${(i + 3) * 0.08}s` }}
                >
                  <p className="text-3xl font-black text-primary">"</p>
                  <blockquote className="mt-2 text-lg font-semibold leading-relaxed">{item.quote}</blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary to-emerald-400" />
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm text-slate-400">{item.company}</p>
                    </div>
                  </div>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}
