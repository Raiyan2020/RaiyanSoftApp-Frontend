import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { createPublicMetadata } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'Terms of Service',
  description: 'General terms of service.',
  path: '/terms',
});

type LegalPage = { slug?: string; title: string; content: string; lastReviewedAt?: string };

export default async function TermsPage() {
  const legalPages = await getPublicWebsiteData<LegalPage>('legal');
  const page = legalPages.find((item) => item.slug === 'terms');
  const paragraphs = page?.content ? page.content.split('\n').map((line) => line.trim()).filter(Boolean) : [];

  return (
    <PublicSimplePage eyebrow="Legal" title={page?.title || 'Terms of Service'} description={page?.lastReviewedAt ? `Last reviewed: ${page.lastReviewedAt}` : 'A legal placeholder that can be replaced from the admin dashboard.'}>
      {paragraphs.length > 0 ? (
        <article className="mx-auto max-w-3xl space-y-5 text-base leading-8 text-slate-700 dark:text-slate-200">
          {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </article>
      ) : (
        <div className="grid gap-4">
          <BasicContentCard title="Website Use" description="The website is used to learn about services and submit contact or quote requests." />
          <BasicContentCard title="Service Scope" description="Any quote or delivery agreement depends on a separate approved project scope." />
          <BasicContentCard title="Legal Review" description="This page should be reviewed by the owner or legal advisor before production use." />
        </div>
      )}
    </PublicSimplePage>
  );
}
