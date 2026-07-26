import type { Metadata } from 'next';
import PublicLayout from '@/components/public/public-layout';
import PageHero from '@/components/public/page-hero';
import SectionShell from '@/components/public/section-shell';
import PublicInquiryForm from '@/components/public/public-inquiry-form';
import JsonLd from '@/components/public/json-ld';
import { getPageMetadata, pageSeo } from '@/lib/page-seo';
import { createContactPageJsonLd, siteConfig } from '@/lib/site';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export const metadata: Metadata = getPageMetadata('contact');

export default async function ContactPage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);

  return (
    <PublicLayout seo={pageSeo.contact}>
      <JsonLd id="contact-page-schema" data={createContactPageJsonLd(pageSeo.contact)} />
      <PageHero
        eyebrow={tt('Contact Us')}
        title={tt('Start with a clear message and we will arrange the next step')}
        description={tt('Write a short summary of what you need and we will review it to respond with the best path forward.')}
      />
      <SectionShell>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="space-y-4">
            <div className="rounded-lg border border-cyan-950/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-black text-primary">{tt('Email')}</p>
              <p className="mt-2 font-bold text-slate-950 dark:text-white">{siteConfig.email}</p>
            </div>
            <div className="rounded-lg border border-cyan-950/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-black text-primary">{tt('Phone')}</p>
              <p className="mt-2 font-bold text-slate-950 dark:text-white" dir="ltr">{siteConfig.phone}</p>
            </div>
          </aside>
          <PublicInquiryForm mode="contact" />
        </div>
      </SectionShell>
    </PublicLayout>
  );
}
