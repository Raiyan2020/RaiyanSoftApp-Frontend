import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { createPublicMetadata } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'Privacy Policy',
  description: 'General privacy policy.',
  path: '/privacy',
});

type LegalPage = { slug?: string; title: string; content: string; lastReviewedAt?: string };

export default async function PrivacyPage() {
  const legalPages = await getPublicWebsiteData<LegalPage>('legal');
  const page = legalPages.find((item) => item.slug === 'privacy');
  const paragraphs = page?.content ? page.content.split('\n').map((line) => line.trim()).filter(Boolean) : [];

  return (
    <PublicSimplePage eyebrow="Legal" title={page?.title || 'Privacy Policy'} description={page?.lastReviewedAt ? `Last reviewed: ${page.lastReviewedAt}` : 'A legal placeholder that can be replaced from the admin dashboard.'}>
      {paragraphs.length > 0 ? (
        <article className="mx-auto max-w-3xl space-y-5 text-base leading-8 text-slate-700 dark:text-slate-200">
          {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </article>
      ) : (
        <div className="grid gap-4">
          <BasicContentCard title="Data We Collect" description="We may collect name, contact details, and project information when forms are submitted." />
          <BasicContentCard title="How Data Is Used" description="Submitted data is used to respond to requests, improve communication, and deliver services." />
          <BasicContentCard title="Legal Review" description="This page should be reviewed by the owner or legal advisor before production use." />
        </div>
      )}
    </PublicSimplePage>
  );
}
