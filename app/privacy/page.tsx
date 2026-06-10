import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import PageHtmlContent from '@/features/pages/components/page-html-content';
import { fetchPrivacyPolicyServer } from '@/features/pages/services/pages-api';
import type { PrivacyPolicyPage } from '@/features/pages/types/page.types';
import { createPublicMetadata } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'Privacy Policy',
  description: 'General privacy policy.',
  path: '/privacy',
});

export default async function PrivacyPage() {
  let page: PrivacyPolicyPage | null = null;

  try {
    page = await fetchPrivacyPolicyServer();
  } catch {
    page = null;
  }

  return (
    <PublicSimplePage
      eyebrow="Legal"
      title={page?.title || 'Privacy Policy'}
      description="How we collect, use, and protect your information."
    >
      <article className="mx-auto max-w-3xl">
        <PageHtmlContent
          html={page?.description}
          emptyMessage="Privacy policy content is not available yet."
        />
      </article>
    </PublicSimplePage>
  );
}
