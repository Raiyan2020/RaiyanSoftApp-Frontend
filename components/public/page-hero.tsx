import Link from 'next/link';
import { translateMessage } from '@/lib/i18n-utils';

type HeroAction = {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
};

type Breadcrumb = {
  label: string;
  href: string;
};

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: HeroAction[];
  breadcrumbs?: Breadcrumb[];
};

export default function PageHero({ eyebrow, title, description, actions = [], breadcrumbs = [] }: PageHeroProps) {
  return (
    <section className="bg-white py-14 dark:bg-navy-950 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {breadcrumbs.length > 0 ? (
          <nav aria-label="مسار الصفحة" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            {breadcrumbs.map((item, index) => (
              <span key={item.href} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                <Link className="transition hover:text-primary" href={item.href}>{translateMessage(item.label)}</Link>
              </span>
            ))}
          </nav>
        ) : null}
        {eyebrow ? <p className="mb-4 text-sm font-black text-primary">{translateMessage(eyebrow)}</p> : null}
        <div className="max-w-3xl">
          <h1 className="text-3xl font-black text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">{translateMessage(title)}</h1>
          <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">{translateMessage(description)}</p>
        </div>
        {actions.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={
                  action.variant === 'secondary'
                    ? 'rounded-lg border border-cyan-950/10 px-5 py-3 text-sm font-black text-slate-800 transition hover:border-primary hover:text-primary dark:border-white/10 dark:text-slate-200'
                    : 'rounded-lg bg-primary px-5 py-3 text-sm font-black text-white transition hover:bg-primary-dark'
                }
              >
                {translateMessage(action.label)}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
