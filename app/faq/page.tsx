import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import PublicFaq from '@/components/public/public-faq';
import JsonLd from '@/components/public/json-ld';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { createFaqJsonLd, createPublicMetadata } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'FAQ',
  description: 'Answers to common questions about digital project delivery.',
  path: '/faq',
});

type PublicFaqItem = { question: string; answer: string };

export default async function FaqPage() {
  const publicFaqs = await getPublicWebsiteData<PublicFaqItem>('faqs');

  return (
    <PublicSimplePage eyebrow="FAQ" title="Answers before we start" description="Common questions about scope, timeline, delivery, and collaboration.">
      <JsonLd id="faq-schema" data={createFaqJsonLd(publicFaqs)} />
      <PublicFaq items={publicFaqs} />
    </PublicSimplePage>
  );
}
