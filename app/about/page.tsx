import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import JsonLd from '@/components/public/json-ld';
import PageHtmlContent from '@/features/pages/components/page-html-content';
import { fetchAboutUsServer } from '@/features/pages/services/pages-api';
import type { AboutUsPage } from '@/features/pages/types/page.types';
import { getPageMetadata, pageSeo } from '@/lib/page-seo';
import { createAboutPageJsonLd } from '@/lib/site';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export const metadata: Metadata = getPageMetadata('about');

export default async function AboutPage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  let page: AboutUsPage | null = null;

  try {
    page = await fetchAboutUsServer(language);
  } catch {
    page = null;
  }

  return (
    <PublicSimplePage
      seoKey="about"
      eyebrow={tt('About Us')}
      title={page?.title || tt('We build clear, growable digital products')}
      description={tt(
        'Raiyan Soft is a technology partner that helps companies turn ideas into apps, websites, and stores that work clearly and serve a specific business goal.',
      )}
    >
      <JsonLd id="about-page-schema" data={createAboutPageJsonLd(pageSeo.about)} />
      <div className="mx-auto max-w-3xl space-y-8">
        <PageHtmlContent
          html={page?.description}
          emptyMessage={tt('About us content is not available yet.')}
        />
      </div>
    </PublicSimplePage>
  );
}
