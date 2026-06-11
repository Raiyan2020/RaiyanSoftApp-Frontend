import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import PublicFaq from '@/components/public/public-faq';
import JsonLd from '@/components/public/json-ld';
import { getPageMetadata } from '@/lib/page-seo';
import { createFaqJsonLd } from '@/lib/site';
import { fetchLandingFaqs } from '@/features/landing-page';

export const metadata: Metadata = getPageMetadata('faq');

export default async function FaqPage() {
  const { header, faqs } = await fetchLandingFaqs('ar');
  const publicFaqs = faqs.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));

  return (
    <PublicSimplePage
      seoKey="faq"
      eyebrow={header?.caption || 'الأسئلة الشائعة'}
      title={header?.title || 'إجابات قبل أن نبدأ'}
      description={header?.description || 'أسئلة شائعة حول النطاق، الجدول الزمني، التسليم، وطريقة التعاون.'}
    >
      <JsonLd id="faq-schema" data={createFaqJsonLd(publicFaqs)} />
      <PublicFaq items={publicFaqs} />
    </PublicSimplePage>
  );
}
