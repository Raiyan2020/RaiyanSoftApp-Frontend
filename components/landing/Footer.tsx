'use client';
import Image from 'next/image';
import { useLandingContent } from '@/features/landing/hooks/use-landing-content';

const footerAnchors = ['#home', '#services', '#works', '#partners', '#contact'];

export default function Footer() {
  const { content, siteName, siteDescription, socialMedia } = useLandingContent();
  const { footer } = content;

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const socialLinks = [
    { key: 'twitter', label: 'X', href: socialMedia?.twitter },
    { key: 'instagram', label: 'IG', href: socialMedia?.instagram },
    { key: 'linkedin', label: 'in', href: socialMedia?.linkedin },
  ].filter((item) => item.href);

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-slate-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(18,169,217,0.2),transparent_32%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-bold text-primary">{footer.ctaBadge}</p>
              <p className="text-2xl font-bold text-white sm:text-3xl">{footer.ctaTitle}</p>
            </div>
            <button
              type="button"
              onClick={() => scrollTo('#contact')}
              className="premium-button touch-lift rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-8 py-4 text-lg font-bold text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:-translate-y-1"
            >
              {footer.ctaButton}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl ring-2 ring-primary/30">
                <Image src="/logo.webp" alt={siteName} fill className="object-cover" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{siteName}</p>
                <p className="text-xs text-slate-500">Raiyansoft</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">{siteDescription}</p>
            {socialLinks.length > 0 ? (
              <div className="flex gap-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.key}
                    href={item.href || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-sm font-black text-slate-300 transition-all duration-200 hover:-translate-y-1 hover:bg-primary hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <FooterList
            title={footer.quickLinksTitle}
            items={footer.quickLinks}
            onClick={(_, index) => scrollTo(footerAnchors[index] || '#home')}
          />
          <FooterList title={footer.servicesTitle} items={footer.services} onClick={() => scrollTo('#services')} />
          <FooterList
            title={footer.resourcesTitle}
            items={footer.resources}
            onClick={(item, index) => {
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
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-center text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {siteName}. {footer.rights}
          </p>
          <p>{footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterList({
  title,
  items,
  onClick,
}: {
  title: string;
  items: string[];
  onClick: (item: string, index: number) => void;
}) {
  return (
    <div>
      <p className="mb-5 text-lg font-bold text-white">{title}</p>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={item}>
            <button
              type="button"
              onClick={() => onClick(item, index)}
              className="group flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-primary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-40 transition-opacity group-hover:opacity-100" />
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
