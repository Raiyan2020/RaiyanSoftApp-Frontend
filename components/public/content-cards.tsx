import Link from 'next/link';
import type { PublicService } from '@/lib/public-content';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

type BasicCardProps = {
  title: string;
  description: string;
  href?: string;
  label?: string;
};

export async function ServiceCard({ service }: { service: PublicService }) {
  const language = await getServerLanguage();
  return (
    <article className="h-full rounded-lg border border-cyan-950/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-black text-primary">{translateMessage(service.shortTitle, language)}</p>
      <h3 className="mt-3 text-xl font-black text-slate-950 dark:text-white">{translateMessage(service.title, language)}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{translateMessage(service.description, language)}</p>
      <Link className="mt-5 inline-flex text-sm font-black text-primary hover:text-primary-dark" href={`/services/${service.slug}`}>
        {translateMessage('Service Details', language)}
      </Link>
    </article>
  );
}

export async function BasicContentCard({ title, description, href, label = 'Read More' }: BasicCardProps) {
  const language = await getServerLanguage();
  const content = (
    <article className="h-full rounded-lg border border-cyan-950/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 dark:border-white/10 dark:bg-white/5">
      <h3 className="text-xl font-black text-slate-950 dark:text-white">{translateMessage(title, language)}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{translateMessage(description, language)}</p>
      {href ? <p className="mt-5 text-sm font-black text-primary">{translateMessage(label, language)}</p> : null}
    </article>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export async function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  const language = await getServerLanguage();
  return (
    <figure className="rounded-lg border border-cyan-950/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <blockquote className="text-sm leading-8 text-slate-700 dark:text-slate-200">"{translateMessage(quote, language)}"</blockquote>
      <figcaption className="mt-5">
        <p className="font-black text-slate-950 dark:text-white">{translateMessage(author, language)}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{translateMessage(role, language)}</p>
      </figcaption>
    </figure>
  );
}

export async function PricingCard({ name, description, features }: { name: string; description: string; features: string[] }) {
  const language = await getServerLanguage();
  return (
    <article className="h-full rounded-lg border border-cyan-950/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <h3 className="text-xl font-black text-slate-950 dark:text-white">{translateMessage(name, language)}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{translateMessage(description, language)}</p>
      <ul className="mt-5 space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm text-slate-700 dark:text-slate-200">
            <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{translateMessage(feature, language)}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
