import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import JsonLd from '@/components/public/json-ld';
import PageHtmlContent from '@/features/pages/components/page-html-content';
import { fetchPrivacyPolicyServer } from '@/features/pages/services/pages-api';
import type { PrivacyPolicyPage } from '@/features/pages/types/page.types';
import { getPageMetadata, pageSeo } from '@/lib/page-seo';
import { createLegalPageJsonLd } from '@/lib/site';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export const metadata: Metadata = getPageMetadata('privacy');

export default async function PrivacyPage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  let page: PrivacyPolicyPage | null = null;

  try {
    page = await fetchPrivacyPolicyServer(language);
  } catch {
    page = null;
  }

  return (
    <PublicSimplePage
      seoKey="privacy"
      eyebrow={tt('Legal')}
      title={page?.title || tt('Privacy Policy')}
      description={tt('How we collect, use, and protect your information.')}
    >
      <JsonLd id="privacy-page-schema" data={createLegalPageJsonLd(pageSeo.privacy)} />
      <article className="mx-auto max-w-3xl">
        <PageHtmlContent
          html={page?.description}
          emptyMessage={tt('Privacy policy content is not available yet.')}
        />
      </article>
    </PublicSimplePage>
  );
}
