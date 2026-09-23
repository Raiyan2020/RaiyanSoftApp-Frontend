import Link from 'next/link';
import type { PublicService } from '@/lib/public-content';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';
import ClampText from '@/components/ui/clamp-text';

type BasicCardProps = {
  title: string;
  description: string;
  href?: string;
  label?: string;
};

export async function ServiceCard({ service }: { service: PublicService }) {
  const language = await getServerLanguage();
  return (
    <article className="flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <p className="text-sm font-black text-primary">{translateMessage(service.shortTitle, language)}</p>
      <h2 className="mt-3 text-xl font-black text-[var(--text)]">{translateMessage(service.title, language)}</h2>
      <ClampText lines={3} className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{translateMessage(service.description, language)}</ClampText>
      <Link className="mt-auto inline-flex self-start pt-5 text-sm font-black text-primary hover:text-primary-dark" href={`/services/${service.slug}`}>
        {translateMessage('Service Details', language)}
      </Link>
    </article>
  );
}

export async function BasicContentCard({ title, description, href, label = 'Read More' }: BasicCardProps) {
  const language = await getServerLanguage();
  const content = (
    <article className="flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <h2 className="text-xl font-black text-[var(--text)]">{translateMessage(title, language)}</h2>
      {/* A linked card can't hold a toggle button (nested interactive); the detail page carries the full text. */}
      {href ? (
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--text-muted)]">{translateMessage(description, language)}</p>
      ) : (
        <ClampText lines={3} className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{translateMessage(description, language)}</ClampText>
      )}
      {href ? <p className="mt-auto pt-5 text-sm font-black text-primary">{translateMessage(label, language)}</p> : null}
    </article>
  );

  return href ? <Link href={href} className="block h-full">{content}</Link> : content;
}

export async function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  const language = await getServerLanguage();
  return (
    <figure className="flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <blockquote>
        <ClampText lines={4} className="text-sm leading-8 text-[var(--text)]">"{translateMessage(quote, language)}"</ClampText>
      </blockquote>
      <figcaption className="mt-auto pt-5">
        <p className="font-black text-[var(--text)]">{translateMessage(author, language)}</p>
        <p className="text-sm text-[var(--text-muted)]">{translateMessage(role, language)}</p>
      </figcaption>
    </figure>
  );
}

export async function PricingCard({
  name,
  description,
  features,
  priceLabel,
  featured = false,
}: {
  name: string;
  description: string;
  features: string[];
  priceLabel?: string | null;
  featured?: boolean;
}) {
  const language = await getServerLanguage();
  return (
    <article className={`flex h-full flex-col rounded-xl border bg-[var(--surface)] p-6 shadow-sm ${featured ? 'border-primary ring-1 ring-primary/40' : 'border-[var(--border)]'}`}>
      {featured ? (
        <p className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{translateMessage('Recommended', language)}</p>
      ) : null}
      <h2 className="text-xl font-black text-[var(--text)]">{translateMessage(name, language)}</h2>
      {priceLabel ? <p className="mt-2 text-2xl font-black text-primary">{priceLabel}</p> : null}
      <ClampText lines={3} className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{translateMessage(description, language)}</ClampText>
      <ul className="mt-5 space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm text-[var(--text)]">
            <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{translateMessage(feature, language)}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
