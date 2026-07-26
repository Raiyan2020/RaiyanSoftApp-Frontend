import Link from 'next/link';
import Image from 'next/image';
import PublicNavigation from './public-navigation';
import PublicWebPageJsonLd from './public-web-page-json-ld';
import { publicServices } from '@/lib/public-content';
import { siteConfig } from '@/lib/site';
import { translateMessage, type AppLanguage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Team', href: '/team' },
  { label: 'Partners', href: '/partners' },
  { label: 'Careers', href: '/careers' },
];

const resourceLinks = [
  { label: 'Blog', href: '/blogs' },
  { label: 'Blog Categories', href: '/blogs/categories' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Works', href: '/portfolio' },
  { label: 'Book a Consultation', href: '/consultation' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
];

type FooterGroupProps = {
  title: string;
  links: { label: string; href: string }[];
  language: AppLanguage;
};

type PublicLayoutProps = {
  children: React.ReactNode;
  seo?: { title: string; description: string; path: string };
};

export default async function PublicLayout({ children, seo }: PublicLayoutProps) {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {seo ? <PublicWebPageJsonLd title={seo.title} description={seo.description} path={seo.path} /> : null}
      <a href="#main-content" className="skip-link">{tt('Skip to content')}</a>
      <PublicNavigation />
      <main id="main-content">{children}</main>
      <footer className="border-t border-slate-200 bg-slate-950 text-slate-300 dark:border-white/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:px-8">
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="relative h-12 w-12 overflow-hidden rounded-xl ring-1 ring-primary/30">
                <Image src="/logo.webp" alt={siteConfig.name} fill className="object-cover" sizes="48px" />
              </span>
              <span>
                <span className="block text-lg font-bold text-white">{siteConfig.name}</span>
                <span className="block text-xs text-slate-500">{siteConfig.englishName}</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-8 text-slate-400">{siteConfig.description}</p>
            <div className="flex flex-wrap gap-3">
              <Link className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark" href="/quote">
                {tt('Get a Quote')}
              </Link>
              <Link className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-primary hover:text-primary" href="/contact">
                {tt('Contact Us')}
              </Link>
            </div>
          </div>

          <FooterGroup title={tt('Company')} links={companyLinks} language={language} />
          <FooterGroup
            title={tt('Services')}
            links={publicServices.map((service) => ({ label: service.shortTitle, href: `/services/${service.slug}` }))}
            language={language}
          />
          <div className="space-y-8">
            <FooterGroup title={tt('Resources')} links={resourceLinks} language={language} />
            <FooterGroup title={tt('Legal')} links={legalLinks} language={language} />
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} {siteConfig.name}. {tt('All rights reserved.')}</p>
            <p>{tt('A separate public site, apart from the client and admin dashboard.')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterGroup({ title, links, language }: FooterGroupProps) {
  return (
    <nav aria-label={title}>
      <p className="mb-4 text-base font-bold text-white">{title}</p>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link className="text-sm text-slate-400 transition hover:text-primary" href={link.href}>
              {translateMessage(link.label, language)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
