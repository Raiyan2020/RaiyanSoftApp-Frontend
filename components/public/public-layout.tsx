import Link from 'next/link';
import Image from 'next/image';
import PublicNavigation from './public-navigation';
import PublicWebPageJsonLd from './public-web-page-json-ld';
import { publicServices } from '@/lib/public-content';
import { siteConfig } from '@/lib/site';

const companyLinks = [
  { label: 'من نحن', href: '/about' },
  { label: 'فريق العمل', href: '/team' },
  { label: 'الشركاء', href: '/partners' },
  { label: 'الوظائف', href: '/careers' },
];

const resourceLinks = [
  { label: 'المدونة', href: '/blogs' },
  { label: 'تصنيفات المدونة', href: '/blogs/categories' },
  { label: 'الأسئلة الشائعة', href: '/faq' },
  { label: 'آراء العملاء', href: '/testimonials' },
  { label: 'أعمالنا', href: '/portfolio' },
  { label: 'حجز استشارة', href: '/consultation' },
];

const legalLinks = [
  { label: 'سياسة الخصوصية', href: '/privacy' },
  { label: 'الشروط والأحكام', href: '/terms' },
];

type FooterGroupProps = {
  title: string;
  links: { label: string; href: string }[];
};

type PublicLayoutProps = {
  children: React.ReactNode;
  seo?: { title: string; description: string; path: string };
};

export default function PublicLayout({ children, seo }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {seo ? <PublicWebPageJsonLd title={seo.title} description={seo.description} path={seo.path} /> : null}
      <a href="#main-content" className="skip-link">تجاوز إلى المحتوى</a>
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
                اطلب عرض سعر
              </Link>
              <Link className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-primary hover:text-primary" href="/contact">
                تواصل معنا
              </Link>
            </div>
          </div>

          <FooterGroup title="الشركة" links={companyLinks} />
          <FooterGroup
            title="الخدمات"
            links={publicServices.map((service) => ({ label: service.shortTitle, href: `/services/${service.slug}` }))}
          />
          <div className="space-y-8">
            <FooterGroup title="الموارد" links={resourceLinks} />
            <FooterGroup title="قانوني" links={legalLinks} />
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} {siteConfig.name}. جميع الحقوق محفوظة.</p>
            <p>موقع عام منفصل عن لوحة العملاء والإدارة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterGroup({ title, links }: FooterGroupProps) {
  return (
    <nav aria-label={title}>
      <p className="mb-4 text-base font-bold text-white">{title}</p>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link className="text-sm text-slate-400 transition hover:text-primary" href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
