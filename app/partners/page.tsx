import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { getPageMetadata } from '@/lib/page-seo';
import { createItemListJsonLd, getCanonicalUrl } from '@/lib/site';

export const metadata: Metadata = getPageMetadata('partners');

type PublicPartner = { name?: string; title?: string; description: string };

export default async function PartnersPage() {
  const partners = await getPublicWebsiteData<PublicPartner>('partners');

  return (
    <PublicSimplePage seoKey="partners" eyebrow="الشركاء" title="شراكات تدعم التنفيذ الرقمي" description="يمكن إدارة أسماء ووصف الشركاء المعتمدين من لوحة التحكم.">
      <JsonLd
        id="partners-list-schema"
        data={createItemListJsonLd(
          partners.map((item) => ({
            name: item.name || item.title || '',
            description: item.description,
            url: getCanonicalUrl('/partners'),
          })),
          'شركاء ريان سوفت',
        )}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {partners.map((item) => <BasicContentCard key={item.name || item.title} title={item.name || item.title || ''} description={item.description} />)}
      </div>
    </PublicSimplePage>
  );
}
