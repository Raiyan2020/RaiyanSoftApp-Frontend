import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { PricingCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { getPageMetadata } from '@/lib/page-seo';
import { createOfferCatalogJsonLd } from '@/lib/site';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export const metadata: Metadata = getPageMetadata('pricing');

type PublicPricingPackage = { name?: string; title?: string; description: string; features: string[] };

export default async function PricingPage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  const pricingPackages = await getPublicWebsiteData<PublicPricingPackage>('pricing', language);

  return (
    <PublicSimplePage
      seoKey="pricing"
      eyebrow={tt('Pricing')}
      title={tt('Clear packages with flexible scope')}
      description={tt('Final pricing depends on integrations and delivery scope; these packages help you identify a starting point.')}
      ctaTitle={tt('Need help choosing the right package?')}
      ctaDescription={tt('Request a quote if the scope is clear, or book a consultation if you want to shape the idea first.')}
    >
      <JsonLd id="pricing-offers-schema" data={createOfferCatalogJsonLd(pricingPackages.map((item) => ({ name: item.name || item.title || '', description: item.description, features: item.features })), language)} />
      <div className="grid gap-4 md:grid-cols-3">
        {pricingPackages.map((item) => (
          <PricingCard key={item.name || item.title} name={item.name || item.title || ''} description={item.description} features={item.features || []} />
        ))}
      </div>
    </PublicSimplePage>
  );
}
