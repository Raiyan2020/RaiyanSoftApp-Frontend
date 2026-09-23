'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useSectionReveal } from './use-section-reveal';
import SectionHeader from './SectionHeader';
import { useLandingContent } from '@/features/landing/hooks/use-landing-content';
import ClampText from '@/components/ui/clamp-text';
import type { LandingPageContent } from '@/features/landing-page';
import FallbackImage from '@/components/ui/fallback-image';
import { translateMessage } from '@/lib/i18n-utils';
import { htmlToText } from '@/lib/html-to-text';

type AboutUsProps = {
  homeData?: LandingPageContent | null;
};

export default function AboutUs({ homeData }: AboutUsProps) {
  const ref = useRef<HTMLDivElement>(null);
  useSectionReveal(ref);
  const { content, lang } = useLandingContent();
  const { partners } = content;
  const apiAbout = homeData?.about_us;
  const apiBanner = homeData?.banners?.idea;

  const headline = apiAbout?.header?.title || partners.title;
  const description = apiAbout?.header?.description || partners.description;
  const cards = apiAbout?.cards ?? [];

  return (
    <section id="about-us" className="relative overflow-hidden bg-slate-50 py-12 dark:bg-navy-900 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgb(var(--primary-glow-rgb) / 0.12),transparent_34%)]" />
      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={headline} description={description} />

        {apiBanner ? (
          <div className="reveal mb-8 rounded-[2rem] border border-cyan-950/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-bold text-primary">{apiBanner.caption || translateMessage('Idea', lang)}</p>
                <h3 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">{apiBanner.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">{htmlToText(apiBanner.description)}</p>
              </div>
              {apiBanner.button_url || apiBanner.button_text ? (
                <div className="flex justify-start lg:justify-end">
                  <a
                    href={apiBanner.button_url || '#contact'}
                    className="inline-flex rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-6 py-3.5 text-base font-bold text-on-primary shadow-xl shadow-primary/25 transition hover:-translate-y-0.5"
                  >
                    {apiBanner.button_text || translateMessage('Learn more', lang)}
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
                <FallbackImage
                  src={card.image}
                  alt={card.title}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 384px"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-sm font-bold text-primary">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">{card.title}</h3>
                <div className="mt-4">
                  <ClampText lines={4} className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    {htmlToText(card.description)}
                  </ClampText>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
