'use client';
import { useRef } from 'react';
import { useSectionReveal } from './use-section-reveal';
import { useLandingContent } from '@/features/landing/hooks/use-landing-content';
import {
  getLandingButtonScrollTarget,
  shouldOpenLandingButtonInNewTab,
  useLandingOffers,
} from '@/features/landing-page';

export default function Packages() {
  const ref = useRef<HTMLDivElement>(null);
  useSectionReveal(ref);
  const { content, textAlign } = useLandingContent();
  const { packages } = content;
  const { data: apiData } = useLandingOffers();

  const badge = apiData?.header?.caption || packages.badge;
  const title = apiData?.header?.title || `${packages.title} ${packages.titleHighlight}`;
  const description = apiData?.header?.description || packages.description;
  const hasApiItems = (apiData?.offers?.length ?? 0) > 0;

  const gridClass = hasApiItems
    ? apiData!.offers.length === 3
      ? 'grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.2fr_0.9fr] lg:items-stretch'
      : 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch'
    : 'grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.2fr_0.9fr] lg:items-stretch';

  return (
    <section id="packages" className="relative overflow-hidden bg-slate-50 py-12 dark:bg-navy-900 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute left-0 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`reveal mb-10 grid gap-6 lg:mb-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end`}>
          <div className={`space-y-4 ${textAlign}`}>
            <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              {badge}
            </div>
            <h2 className="text-2xl font-bold leading-[1.34] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.35rem]">
              {title}
            </h2>
          </div>
          <p className={`mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 lg:mx-0 ${textAlign}`}>
            {description}
          </p>
        </div>

        <div className={gridClass}>
          {hasApiItems
            ? apiData!.offers.map((offer, i) => (
                <article
                  key={offer.id}
                  className={`reveal rounded-[2rem] border p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 sm:p-8 ${
                    offer.most_requested
                      ? 'border-primary/30 bg-slate-950 text-white shadow-2xl shadow-cyan-950/20 lg:-mt-6 lg:mb-6'
                      : 'border-cyan-950/10 bg-white text-slate-950 hover:shadow-[var(--shadow-glow)] dark:border-white/10 dark:bg-white/5 dark:text-white'
                  }`}
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  {offer.most_requested ? (
                    <span className="mb-5 inline-flex rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
                      {packages.popularBadge}
                    </span>
                  ) : null}
                  <h3 className="text-2xl font-bold">{offer.title}</h3>
                  <p className={`mt-3 leading-relaxed ${offer.most_requested ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>
                    {offer.caption}
                  </p>
                  {offer.description ? (
                    <p className={`mt-3 text-sm leading-relaxed ${offer.most_requested ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      {offer.description}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      if (shouldOpenLandingButtonInNewTab(offer.button_url)) {
                        window.open(offer.button_url!, '_blank');
                      } else {
                        document
                          .querySelector(getLandingButtonScrollTarget(offer.button_url, '#contact'))
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`mt-8 w-full rounded-2xl px-5 py-3 font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                      offer.most_requested
                        ? 'bg-gradient-to-l from-primary to-primary-dark text-white shadow-lg shadow-primary/25'
                        : 'border border-primary/25 text-primary hover:bg-primary/10'
                    }`}
                  >
                    {offer.button_text || packages.items[0]?.cta}
                  </button>
                </article>
              ))
            : packages.items.map((item, i) => (
                <article
                  key={item.name}
                  className={`reveal rounded-[2rem] border p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 sm:p-8 ${
                    item.highlighted
                      ? 'border-primary/30 bg-slate-950 text-white shadow-2xl shadow-cyan-950/20 lg:-mt-6 lg:mb-6'
                      : 'border-cyan-950/10 bg-white text-slate-950 hover:shadow-[var(--shadow-glow)] dark:border-white/10 dark:bg-white/5 dark:text-white'
                  }`}
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  {item.highlighted ? (
                    <span className="mb-5 inline-flex rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
                      {packages.popularBadge}
                    </span>
                  ) : null}
                  <h3 className="text-2xl font-bold">{item.name}</h3>
                  <p className={`mt-3 leading-relaxed ${item.highlighted ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>{item.bestFor}</p>
                  <ul className="mt-7 space-y-3">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-sm font-semibold">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className={`mt-8 w-full rounded-2xl px-5 py-3 font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                      item.highlighted
                        ? 'bg-gradient-to-l from-primary to-primary-dark text-white shadow-lg shadow-primary/25'
                        : 'border border-primary/25 text-primary hover:bg-primary/10'
                    }`}
                  >
                    {item.cta}
                  </button>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}
