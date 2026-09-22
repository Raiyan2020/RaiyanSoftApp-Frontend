import Link from 'next/link';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

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

export default async function PageHero({ eyebrow, title, description, actions = [], breadcrumbs = [] }: PageHeroProps) {
  const language = await getServerLanguage();
  const resolvedTitle = translateMessage(title, language);
  const resolvedEyebrow = eyebrow ? translateMessage(eyebrow, language) : null;
  // Pages routinely pass an eyebrow that the CMS title then repeats verbatim
  // ("About Us" over "About Us"); showing it twice reads as a mistake.
  const showEyebrow = resolvedEyebrow && resolvedEyebrow.trim() !== resolvedTitle.trim();

  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--surface)] py-14 sm:py-16 lg:py-20">
      {/* A faint accent wash separates the hero from the body section, which
          otherwise sat on an identical white with no boundary. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-primary/[0.07] to-transparent"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {breadcrumbs.length > 0 ? (
          <nav aria-label={translateMessage('Breadcrumb', language)} className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[var(--text-muted)]">
            {breadcrumbs.map((item, index) => (
              <span key={item.href} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true" className="opacity-50">/</span> : null}
                {index === breadcrumbs.length - 1 ? (
                  <span aria-current="page" className="font-bold text-[var(--text)]">{translateMessage(item.label, language)}</span>
                ) : (
                  <Link className="inline-block py-1 transition hover:text-primary" href={item.href}>{translateMessage(item.label, language)}</Link>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        {showEyebrow ? (
          <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-primary">{resolvedEyebrow}</p>
        ) : null}
        <div className="max-w-3xl">
          <h1 className="text-3xl font-black text-[var(--text)] sm:text-4xl lg:text-5xl">{resolvedTitle}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">{translateMessage(description, language)}</p>
        </div>
        {actions.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={
                  action.variant === 'secondary'
                    ? 'rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-black text-[var(--text)] transition hover:border-primary hover:text-primary dark:text-slate-200'
                    : 'rounded-xl bg-primary px-5 py-3 text-sm font-black text-on-primary transition hover:bg-primary-dark'
                }
              >
                {translateMessage(action.label, language)}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
