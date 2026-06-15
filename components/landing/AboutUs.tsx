'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useSectionReveal } from './use-section-reveal';
import { useLandingContent } from '@/features/landing/hooks/use-landing-content';
import type { LandingPageContent } from '@/features/landing-page';
import SafeImage from '@/components/ui/safe-image';

type AboutUsProps = {
  homeData?: LandingPageContent | null;
};

export default function AboutUs({ homeData }: AboutUsProps) {
  const ref = useRef<HTMLDivElement>(null);
  useSectionReveal(ref);
  const { content, textAlign } = useLandingContent();
  const { partners } = content;
  const apiAbout = homeData?.about_us;
  const apiBanner = homeData?.banners?.idea;

  const headline = apiAbout?.header?.title || partners.title;
  const subtitle = apiAbout?.header?.caption || partners.badge;
  const description = apiAbout?.header?.description || partners.description;
  const cards = apiAbout?.cards ?? [];

  return (
    <section id="about-us" className="relative overflow-hidden bg-slate-50 py-12 dark:bg-navy-900 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(18,169,217,0.12),transparent_34%)]" />
      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`reveal mb-10 text-center lg:mb-12 ${textAlign}`}>
          <div className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            {subtitle}
          </div>
          <h2 className="text-2xl font-bold leading-[1.34] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.35rem]">
            {headline}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            {description}
          </p>
        </div>

        {apiBanner ? (
          <div className="reveal mb-8 rounded-[2rem] border border-cyan-950/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-bold text-primary">{apiBanner.caption || 'Idea'}</p>
                <h3 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">{apiBanner.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">{apiBanner.description}</p>
              </div>
              {apiBanner.button_url || apiBanner.button_text ? (
                <div className="flex justify-start lg:justify-end">
                  <a
                    href={apiBanner.button_url || '#contact'}
                    className="inline-flex rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-primary/25 transition hover:-translate-y-0.5"
                  >
                    {apiBanner.button_text || 'Learn more'}
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, index) => (
            <article
              key={card.id}
              className="reveal overflow-hidden rounded-[2rem] border border-cyan-950/10 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[var(--shadow-glow)] dark:border-white/10 dark:bg-white/5"
              style={{ transitionDelay: `${index * 0.08}s` }}
            >
              <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-white/5">
                {card.image ? (
                  <SafeImage src={card.image} alt={card.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-6xl font-black text-primary/20">01</div>
                )}
              </div>
              <div className="p-6">
                <p className="text-sm font-bold text-primary">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">{card.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
