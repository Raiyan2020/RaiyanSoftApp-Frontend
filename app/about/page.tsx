import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import JsonLd from '@/components/public/json-ld';
import PageHtmlContent from '@/features/pages/components/page-html-content';
import { fetchAboutUsServer } from '@/features/pages/services/pages-api';
import type { AboutUsPage } from '@/features/pages/types/page.types';
import { getPageMetadata, pageSeo } from '@/lib/page-seo';
import { createAboutPageJsonLd } from '@/lib/site';

export const metadata: Metadata = getPageMetadata('about');

export default async function AboutPage() {
  let page: AboutUsPage | null = null;

  try {
    page = await fetchAboutUsServer();
  } catch {
    page = null;
  }

  const about = page?.about_us;
  const contact = page?.contact_us;

  return (
    <PublicSimplePage
      seoKey="about"
      eyebrow="من نحن"
      title={about?.title || 'نبني منتجات رقمية واضحة وقابلة للنمو'}
      description={about?.caption || 'ريان سوفت شريك تقني يساعد الشركات على تحويل الأفكار إلى تطبيقات ومواقع ومتاجر تعمل بوضوح وتخدم هدفا تجاريا محددا.'}
    >
      <JsonLd id="about-page-schema" data={createAboutPageJsonLd(pageSeo.about)} />
      <div className="mx-auto max-w-3xl space-y-8">
        <PageHtmlContent
          html={about?.description}
          emptyMessage="About us content is not available yet."
        />

        {contact?.email || contact?.url ? (
          <div className="grid gap-4 md:grid-cols-2">
            {contact.email ? (
              <a
                href={`mailto:${contact.email}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-medium text-slate-800 transition hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {contact.email}
              </a>
            ) : null}
            {contact.url ? (
              <a
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-medium text-slate-800 transition hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {contact.url.replace(/^https?:\/\//, '')}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </PublicSimplePage>
  );
}
