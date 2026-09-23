import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard, PricingCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import { fetchPublicPricingPlans } from '@/features/landing-page/services/public-landing-api';
import { getPageMetadata } from '@/lib/page-seo';
import { createOfferCatalogJsonLd } from '@/lib/site';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('pricing', await getServerLanguage());
}

export default async function PricingPage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  const pricingPlans = await fetchPublicPricingPlans(language);

  return (
    <PublicSimplePage
      seoKey="pricing"
      eyebrow={tt('Pricing')}
      title={tt('Clear packages with flexible scope')}
      description={tt('Final pricing depends on integrations and delivery scope; these packages help you identify a starting point.')}
    >
      <JsonLd
        id="pricing-offers-schema"
        data={createOfferCatalogJsonLd(pricingPlans.map((item) => ({ name: item.name, description: item.description, features: item.features })), language)}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {pricingPlans.length > 0 ? (
          pricingPlans.map((item) => (
            <PricingCard
              key={item.id}
              name={item.name}
              description={item.description}
              features={item.features}
              priceLabel={item.price_label}
              featured={item.is_featured}
            />
          ))
        ) : (
          <BasicContentCard title={tt('Packages coming soon')} description={tt('Request a quote and we will suggest the right scope for your project.')} />
        )}
      </div>
    </PublicSimplePage>
  );
}
