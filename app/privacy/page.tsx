import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import JsonLd from '@/components/public/json-ld';
import PageHtmlContent from '@/features/pages/components/page-html-content';
import { fetchPrivacyPolicyServer } from '@/features/pages/services/pages-api';
import type { PrivacyPolicyPage } from '@/features/pages/types/page.types';
import { getPageMetadata, pageSeo } from '@/lib/page-seo';
import { createLegalPageJsonLd } from '@/lib/site';

export const metadata: Metadata = getPageMetadata('privacy');

export default async function PrivacyPage() {
  let page: PrivacyPolicyPage | null = null;

  try {
    page = await fetchPrivacyPolicyServer();
  } catch {
    page = null;
  }

  return (
    <PublicSimplePage
      seoKey="privacy"
      eyebrow="قانوني"
      title={page?.title || 'سياسة الخصوصية'}
      description="كيف نجمع معلوماتك ونستخدمها ونحميها."
    >
      <JsonLd id="privacy-page-schema" data={createLegalPageJsonLd(pageSeo.privacy)} />
      <article className="mx-auto max-w-3xl">
        <PageHtmlContent
          html={page?.description}
          emptyMessage="Privacy policy content is not available yet."
        />
      </article>
    </PublicSimplePage>
  );
}
