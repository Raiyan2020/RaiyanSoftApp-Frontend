import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import JsonLd from '@/components/public/json-ld';
import PageHtmlContent from '@/features/pages/components/page-html-content';
import { fetchTermsConditionsServer } from '@/features/pages/services/pages-api';
import type { TermsConditionsPage } from '@/features/pages/types/page.types';
import { getPageMetadata, pageSeo } from '@/lib/page-seo';
import { createLegalPageJsonLd } from '@/lib/site';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export const metadata: Metadata = getPageMetadata('terms');

export default async function TermsPage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  let page: TermsConditionsPage | null = null;

  try {
    page = await fetchTermsConditionsServer(language);
  } catch {
    page = null;
  }

  return (
    <PublicSimplePage
      seoKey="terms"
      eyebrow={tt('Legal')}
      title={page?.title || tt('Terms & Conditions')}
      description={tt('Terms and conditions for using our services.')}
    >
      <JsonLd id="terms-page-schema" data={createLegalPageJsonLd(pageSeo.terms)} />
      <article className="mx-auto max-w-3xl">
        <PageHtmlContent
          html={page?.description}
          emptyMessage={tt('Terms and conditions content is not available yet.')}
        />
      </article>
    </PublicSimplePage>
  );
}
