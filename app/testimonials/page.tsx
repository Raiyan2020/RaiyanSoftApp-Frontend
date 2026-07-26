import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { TestimonialCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { getPageMetadata } from '@/lib/page-seo';
import { createReviewListJsonLd } from '@/lib/site';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export const metadata: Metadata = getPageMetadata('testimonials');

type PublicTestimonial = { quote: string; author: string; role?: string; company?: string };

export default async function TestimonialsPage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  const testimonials = await getPublicWebsiteData<PublicTestimonial>('testimonials', language);

  return (
    <PublicSimplePage
      seoKey="testimonials"
      eyebrow={tt('Customer Reviews')}
      title={tt('Trust is built through real experiences.')}
      description={tt('We only publicly display approved customer reviews.')}
    >
      <JsonLd id="testimonials-list-schema" data={createReviewListJsonLd(testimonials, language)} />
      <div className="grid gap-4 md:grid-cols-2">
        {testimonials.map((item) => <TestimonialCard key={item.author} quote={item.quote} author={item.author} role={item.role || item.company || ''} />)}
      </div>
    </PublicSimplePage>
  );
}
