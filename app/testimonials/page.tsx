import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { TestimonialCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { getPageMetadata } from '@/lib/page-seo';
import { createReviewListJsonLd } from '@/lib/site';

export const metadata: Metadata = getPageMetadata('testimonials');

type PublicTestimonial = { quote: string; author: string; role?: string; company?: string };

export default async function TestimonialsPage() {
  const testimonials = await getPublicWebsiteData<PublicTestimonial>('testimonials');

  return (
    <PublicSimplePage seoKey="testimonials" eyebrow="آراء العملاء" title="الثقة تُبنى بتجارب حقيقية" description="نعرض علناً فقط آراء العملاء المعتمدة.">
      <JsonLd id="testimonials-list-schema" data={createReviewListJsonLd(testimonials)} />
      <div className="grid gap-4 md:grid-cols-2">
        {testimonials.map((item) => <TestimonialCard key={item.author} quote={item.quote} author={item.author} role={item.role || item.company || ''} />)}
      </div>
    </PublicSimplePage>
  );
}
