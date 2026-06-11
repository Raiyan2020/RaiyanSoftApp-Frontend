import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { PricingCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { getPageMetadata } from '@/lib/page-seo';
import { createOfferCatalogJsonLd } from '@/lib/site';

export const metadata: Metadata = getPageMetadata('pricing');

type PublicPricingPackage = { name?: string; title?: string; description: string; features: string[] };

export default async function PricingPage() {
  const pricingPackages = await getPublicWebsiteData<PublicPricingPackage>('pricing');

  return (
    <PublicSimplePage
      seoKey="pricing"
      eyebrow="الأسعار"
      title="باقات واضحة بنطاق مرن"
      description="التسعير النهائي يعتمد على التكاملات ونطاق التسليم، وهذه الباقات تساعد على تحديد نقطة البداية."
      ctaTitle="تحتاج مساعدة في اختيار الباقة المناسبة؟"
      ctaDescription="اطلب عرض سعر إذا كان النطاق واضحاً، أو احجز استشارة إذا أردت صياغة الفكرة أولاً."
    >
      <JsonLd id="pricing-offers-schema" data={createOfferCatalogJsonLd(pricingPackages.map((item) => ({ name: item.name || item.title || '', description: item.description, features: item.features })))} />
      <div className="grid gap-4 md:grid-cols-3">
        {pricingPackages.map((item) => (
          <PricingCard key={item.name || item.title} name={item.name || item.title || ''} description={item.description} features={item.features || []} />
        ))}
      </div>
    </PublicSimplePage>
  );
}
