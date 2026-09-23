'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { useSectionReveal } from './use-section-reveal';
import SectionHeader from './SectionHeader';
import { QuickBookingDialog } from './lazy-quick-dialogs';
import { useLandingContent } from '@/features/landing/hooks/use-landing-content';
import { runLandingButtonAction } from '@/features/landing-page';
import type { LandingPageContent } from '@/features/landing-page';
import PageHtmlContent from '@/features/pages/components/page-html-content';
import ClampText from '@/components/ui/clamp-text';

type PackagesProps = {
  homeData?: LandingPageContent | null;
};

type PackageCard = {
  key: string | number;
  title: string;
  subtitle: string;
  descriptionHtml?: string | null;
  features: string[];
  cta: string;
  featured: boolean;
  /** Backend link; empty/`#` falls back to the booking dialog. */
  buttonUrl?: string | null;
};

export default function Packages({ homeData }: PackagesProps) {
  const ref = useRef<HTMLDivElement>(null);
  useSectionReveal(ref);
  const router = useRouter();
  const [bookingOpen, setBookingOpen] = useState(false);
  const { content } = useLandingContent();
  const { packages } = content;
  const apiOffers = homeData?.offers;

  const title = apiOffers?.header?.title || `${packages.title} ${packages.titleHighlight}`;
  const description = apiOffers?.header?.description || packages.description;

  const cards: PackageCard[] = apiOffers?.offers?.length
    ? apiOffers.offers.map((offer) => ({
        key: offer.id,
        title: offer.title,
        subtitle: offer.caption,
        descriptionHtml: offer.description,
        features: [],
        cta: offer.button_text || packages.items[0]?.cta || '',
        featured: offer.most_requested,
        buttonUrl: offer.button_url,
      }))
    : packages.items.map((item) => ({
        key: item.name,
        title: item.name,
        subtitle: item.bestFor,
        features: item.features,
        cta: item.cta,
        featured: Boolean(item.highlighted),
      }));

  const openBooking = () => setBookingOpen(true);

  return (
    <>
      <section id="packages" className="relative overflow-hidden bg-slate-50 py-12 dark:bg-navy-900 sm:py-16 lg:py-20">
        <div className="pointer-events-none absolute start-0 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={title} description={description} />

          <div className="grid grid-cols-1 gap-6 pt-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {cards.map((card) => (
              // `.reveal` animates transform with fill-mode both, so hover/elevation transforms live on the inner article.
              <div key={card.key} className="reveal h-full md:last:odd:col-span-2 lg:last:odd:col-span-1">
                <article
                  className={`relative flex h-full flex-col rounded-3xl border bg-white p-6 text-slate-950 transition duration-300 hover:shadow-[var(--shadow-glow)] motion-safe:hover:-translate-y-1 dark:bg-white/5 dark:text-white sm:p-8 ${
                    card.featured
                      ? 'border-primary shadow-[var(--shadow-glow)] ring-1 ring-primary/40 dark:bg-navy-950 lg:-translate-y-4 lg:motion-safe:hover:-translate-y-5'
                      : 'border-slate-200 shadow-sm dark:border-white/10'
                  }`}
                >
                  {card.featured ? (
                    <>
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 rounded-t-3xl bg-gradient-to-b from-primary/10 to-transparent" />
                      <span className="absolute inset-x-0 -top-3 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary shadow-md shadow-primary/30">
                        {packages.popularBadge}
                      </span>
                    </>
                  ) : null}

                  <h3 className="relative text-xl font-bold sm:text-2xl">{card.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">{card.subtitle}</p>

                  <div className="relative mt-6 flex-1 border-t border-slate-200 pt-6 dark:border-white/10">
                    {card.descriptionHtml ? (
                      <ClampText lines={4}>
                        <PageHtmlContent html={card.descriptionHtml} className="text-sm leading-relaxed text-slate-600 dark:text-slate-400" />
                      </ClampText>
                    ) : null}
                    {card.features.length > 0 ? (
                      <ul className="space-y-3">
                        {card.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-sm font-semibold leading-relaxed">
                            <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Check className="h-3 w-3" strokeWidth={3} />
                            </span>
                            <span className="min-w-0">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => runLandingButtonAction(card.buttonUrl, { onFallback: openBooking, navigate: router.push })}
                    className={`relative mt-auto inline-flex h-12 w-full items-center justify-center rounded-2xl px-5 text-sm font-bold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-navy-900 sm:text-base ${
                      card.featured
                        ? 'bg-primary text-on-primary shadow-lg shadow-primary/25 hover:bg-primary-dark'
                        : 'border border-primary text-primary hover:bg-primary/10'
                    }`}
                  >
                    {card.cta}
                  </button>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
      <QuickBookingDialog isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
