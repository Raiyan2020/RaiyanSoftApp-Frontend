import TrackedLink from './tracked-link';
import { translateMessage } from '@/lib/i18n-utils';

type CtaBlockProps = {
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export default function CtaBlock({
  title,
  description,
  primaryLabel = 'اطلب عرض سعر',
  primaryHref = '/quote',
  secondaryLabel = 'تواصل معنا',
  secondaryHref = '/contact',
}: CtaBlockProps) {
  return (
    <section className="bg-slate-950 py-14 text-white sm:py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-black sm:text-3xl">{translateMessage(title)}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{translateMessage(description)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <TrackedLink
            href={primaryHref}
            eventName="cta_click"
            eventPayload={{ location: 'cta_block', href: primaryHref, label: primaryLabel }}
            className="rounded-lg bg-primary px-5 py-3 text-sm font-black text-white transition hover:bg-primary-dark"
          >
            {translateMessage(primaryLabel)}
          </TrackedLink>
          <TrackedLink
            href={secondaryHref}
            eventName="cta_click"
            eventPayload={{ location: 'cta_block', href: secondaryHref, label: secondaryLabel }}
            className="rounded-lg border border-white/15 px-5 py-3 text-sm font-black text-slate-100 transition hover:border-primary hover:text-primary"
          >
            {translateMessage(secondaryLabel)}
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
