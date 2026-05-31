import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { TestimonialCard } from '@/components/public/content-cards';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { createPublicMetadata } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'Testimonials',
  description: 'Approved client testimonials.',
  path: '/testimonials',
});

type PublicTestimonial = { quote: string; author: string; role?: string; company?: string };

export default async function TestimonialsPage() {
  const testimonials = await getPublicWebsiteData<PublicTestimonial>('testimonials');

  return (
    <PublicSimplePage eyebrow="Testimonials" title="Trust is built through real experiences" description="Only approved testimonials are shown publicly.">
      <div className="grid gap-4 md:grid-cols-2">
        {testimonials.map((item) => <TestimonialCard key={item.author} quote={item.quote} author={item.author} role={item.role || item.company || ''} />)}
      </div>
    </PublicSimplePage>
  );
}
