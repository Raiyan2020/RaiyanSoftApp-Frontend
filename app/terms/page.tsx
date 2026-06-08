import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import PageHtmlContent from '@/features/pages/components/page-html-content';
import { fetchTermsConditionsServer } from '@/features/pages/api/pages-api';
import type { TermsConditionsPage } from '@/features/pages/types/page.types';
import { createPublicMetadata } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'Terms of Service',
  description: 'General terms of service.',
  path: '/terms',
});

export default async function TermsPage() {
  let page: TermsConditionsPage | null = null;

  try {
    page = await fetchTermsConditionsServer();
  } catch {
    page = null;
  }

  return (
    <PublicSimplePage
      eyebrow="Legal"
      title={page?.title || 'Terms of Service'}
      description="Terms and conditions for using our services."
    >
      <article className="mx-auto max-w-3xl">
        <PageHtmlContent
          html={page?.description}
          emptyMessage="Terms and conditions content is not available yet."
        />
      </article>
    </PublicSimplePage>
  );
}
