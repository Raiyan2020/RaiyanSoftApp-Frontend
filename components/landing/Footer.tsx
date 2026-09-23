'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { QuickBookingDialog } from './lazy-quick-dialogs';
import { useTranslation } from '@/lib/i18nContext';
import { useLandingContent } from '@/features/landing/hooks/use-landing-content';
import type { LandingPageContent } from '@/features/landing-page';

const footerAnchors = ['#home', '#services', '#works', '#partners', '#contact'];

type FooterProps = {
  homeData?: LandingPageContent | null;
};

export default function Footer({ homeData }: FooterProps) {
  const { t } = useTranslation();
  const { content, siteName, siteDescription, socialMedia } = useLandingContent();
  const { footer } = content;
  // About is a real page, so it's a Link rather than a section anchor.
  const quickLinks: FooterItem[] = [
    footer.quickLinks[0],
    { label: t('landing.nav.about'), href: '/about' },
    ...footer.quickLinks.slice(1),
  ];
  const banner = homeData?.banners?.footer;
  const [bookingOpen, setBookingOpen] = useState(false);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    // Off the home page the section anchors don't exist, so go to them on /.
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else window.location.href = `/${href}`;
  };

  const socialLabels: Record<string, string> = {
    facebook: 'f',
    twitter: 'X',
    instagram: 'IG',
    linkedin: 'in',
    youtube: 'YT',
    tiktok: 'TT',
    snapchat: 'SC',
  };
  const socialLinks = Object.entries(socialMedia || {})
    .filter(([, href]) => Boolean(href))
    .map(([key, href]) => ({
      key,
      label: socialLabels[key.toLowerCase()] || key.slice(0, 2).toUpperCase(),
      href,
    }));

  return (
    <>
      <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-slate-300">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgb(var(--primary-glow-rgb) / 0.2),transparent_32%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="mb-3 text-sm font-bold text-cyan-300">{banner?.caption || footer.ctaBadge}</p>
                <p className="text-2xl font-bold text-white sm:text-3xl">{banner?.title || footer.ctaTitle}</p>
                {banner?.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{banner.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="premium-button touch-lift rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-8 py-4 text-lg font-bold text-on-primary shadow-xl shadow-primary/25 transition-all duration-300 hover:-translate-y-1"
              >
                {banner?.button_text || footer.ctaButton}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            <div className="col-span-2 min-w-0 space-y-5 md:col-span-3 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl ring-2 ring-primary/30">
                  <Image src="/logo.webp" alt={siteName} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{siteName}</p>
                  {/* i18n-ignore-next-line: brand name, never translated */}
                  <p className="text-xs text-slate-300">Raiyansoft</p>
                </div>
              </div>
              <p className="break-words text-sm leading-relaxed text-slate-300">{siteDescription}</p>
              {socialLinks.length > 0 ? (
                <div className="flex max-w-full flex-wrap gap-2 lg:grid lg:w-fit lg:grid-cols-4">
                  {socialLinks.map((item) => (
                    <a
                      key={item.key}
                      href={item.href || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-sm font-black text-slate-300 transition-all duration-200 hover:-translate-y-1 hover:bg-primary hover:text-on-primary"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <FooterList
              title={footer.quickLinksTitle}
              items={quickLinks}
              onClick={(item) => scrollTo(footerAnchors[footer.quickLinks.indexOf(item)] || '#home')}
            />
            <FooterList title={footer.servicesTitle} items={footer.services} onClick={() => scrollTo('#services')} />
            <FooterList
              title={footer.resourcesTitle}
              items={footer.resources}
              onClick={(_, index) => {
                if (index === 0) window.location.href = '/blogs';
                else if (index === 1) window.location.href = '/blogs/categories';
                else if (index === 2) window.location.href = '/privacy';
                else if (index === 3) window.location.href = '/terms';
                else scrollTo('#contact');
              }}
            />
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-center text-sm text-slate-300 sm:flex-row sm:px-6 lg:px-8">
            <p>
              © {new Date().getFullYear()} {siteName}. {footer.rights}
            </p>
            <p>{footer.tagline}</p>
          </div>
        </div>
      </footer>
      <QuickBookingDialog isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}

type FooterItem = string | { label: string; href: string };

// This footer band is bg-slate-950 in both themes, so the hover colour must
// come from --primary-glow-rgb (tuned bright-on-dark in both themes) rather
// than --primary-rgb, which is tuned dark for light-theme's white surface and
// measured 3.6:1 here.
const itemClass =
  'group flex min-w-0 items-start gap-2 break-words text-start text-sm text-slate-300 transition-colors duration-200 hover:text-cyan-300';

function FooterList({
  title,
  items,
  onClick,
}: {
  title: string;
  items: FooterItem[];
  onClick: (item: string, index: number) => void;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-5 break-words text-lg font-bold text-white">{title}</p>
      <ul className="space-y-3">
        {items.map((item, index) => {
          const dot = (
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary opacity-40 transition-opacity group-hover:opacity-100" />
          );
          return typeof item === 'string' ? (
            <li key={item}>
              <button type="button" onClick={() => onClick(item, index)} className={itemClass}>
                {dot}
                {item}
              </button>
            </li>
          ) : (
            <li key={item.href}>
              <Link href={item.href} className={itemClass}>
                {dot}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
