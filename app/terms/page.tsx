import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import JsonLd from '@/components/public/json-ld';
import PageHtmlContent from '@/features/pages/components/page-html-content';
import { fetchTermsConditionsServer } from '@/features/pages/services/pages-api';
import type { TermsConditionsPage } from '@/features/pages/types/page.types';
import { getPageMetadata, pageSeo } from '@/lib/page-seo';
import { createLegalPageJsonLd } from '@/lib/site';

export const metadata: Metadata = getPageMetadata('terms');

export default async function TermsPage() {
  let page: TermsConditionsPage | null = null;

  try {
    page = await fetchTermsConditionsServer();
  } catch {
    page = null;
  }

  return (
    <PublicSimplePage
      seoKey="terms"
      eyebrow="قانوني"
      title={page?.title || 'الشروط والأحكام'}
      description="الشروط والأحكام لاستخدام خدماتنا."
    >
      <JsonLd id="terms-page-schema" data={createLegalPageJsonLd(pageSeo.terms)} />
      <article className="mx-auto max-w-3xl">
        <PageHtmlContent
          html={page?.description}
          emptyMessage="Terms and conditions content is not available yet."
        />
      </article>
    </PublicSimplePage>
  );
}
