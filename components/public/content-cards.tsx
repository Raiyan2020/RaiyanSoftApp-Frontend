import Link from 'next/link';
import type { PublicService } from '@/lib/public-content';

type BasicCardProps = {
  title: string;
  description: string;
  href?: string;
  label?: string;
};

export function ServiceCard({ service }: { service: PublicService }) {
  return (
    <article className="h-full rounded-lg border border-cyan-950/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-black text-primary">{service.shortTitle}</p>
      <h3 className="mt-3 text-xl font-black text-slate-950 dark:text-white">{service.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{service.description}</p>
      <Link className="mt-5 inline-flex text-sm font-black text-primary hover:text-primary-dark" href={`/services/${service.slug}`}>
        تفاصيل الخدمة
      </Link>
    </article>
  );
}

export function BasicContentCard({ title, description, href, label = 'اقرأ المزيد' }: BasicCardProps) {
  const content = (
    <article className="h-full rounded-lg border border-cyan-950/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 dark:border-white/10 dark:bg-white/5">
      <h3 className="text-xl font-black text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>
      {href ? <p className="mt-5 text-sm font-black text-primary">{label}</p> : null}
    </article>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <figure className="rounded-lg border border-cyan-950/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <blockquote className="text-sm leading-8 text-slate-700 dark:text-slate-200">"{quote}"</blockquote>
      <figcaption className="mt-5">
        <p className="font-black text-slate-950 dark:text-white">{author}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{role}</p>
      </figcaption>
    </figure>
  );
}

export function PricingCard({ name, description, features }: { name: string; description: string; features: string[] }) {
  return (
    <article className="h-full rounded-lg border border-cyan-950/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <h3 className="text-xl font-black text-slate-950 dark:text-white">{name}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>
      <ul className="mt-5 space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm text-slate-700 dark:text-slate-200">
            <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

