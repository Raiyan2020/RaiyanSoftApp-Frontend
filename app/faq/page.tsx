import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import PublicFaq from '@/components/public/public-faq';
import JsonLd from '@/components/public/json-ld';
import { getPageMetadata } from '@/lib/page-seo';
import { createFaqJsonLd } from '@/lib/site';
import { fetchLandingFaqs } from '@/features/landing-page';
import { getServerLanguage } from '@/lib/language.server';
import { translateMessage } from '@/lib/i18n-utils';

export const metadata: Metadata = getPageMetadata('faq');

export default async function FaqPage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  const { header, faqs } = await fetchLandingFaqs(language);
  const publicFaqs = faqs.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));

  return (
    <PublicSimplePage
      seoKey="faq"
      eyebrow={header?.caption || tt('Frequently Asked Questions')}
      title={header?.title || tt('Answers before we begin')}
      description={header?.description || tt('Frequently asked questions about scope, timeline, delivery, and how we work together.')}
    >
      <JsonLd id="faq-schema" data={createFaqJsonLd(publicFaqs)} />
      <PublicFaq items={publicFaqs} />
    </PublicSimplePage>
  );
}
