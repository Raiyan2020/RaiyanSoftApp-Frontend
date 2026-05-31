import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { PricingCard } from '@/components/public/content-cards';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { createPublicMetadata } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'Pricing',
  description: 'Website, app, and digital product packages by project scope.',
  path: '/pricing',
});

type PublicPricingPackage = { name?: string; title?: string; description: string; features: string[] };

export default async function PricingPage() {
  const pricingPackages = await getPublicWebsiteData<PublicPricingPackage>('pricing');

  return (
    <PublicSimplePage
      eyebrow="Pricing"
      title="Clear packages with flexible scope"
      description="Final pricing depends on integrations and delivery scope, but these packages help define the starting point."
      ctaTitle="Need help choosing the right package?"
      ctaDescription="Request a quote if the scope is clear, or book a consultation if you want to shape the idea first."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {pricingPackages.map((item) => (
          <PricingCard key={item.name || item.title} name={item.name || item.title || ''} description={item.description} features={item.features || []} />
        ))}
      </div>
    </PublicSimplePage>
  );
}
