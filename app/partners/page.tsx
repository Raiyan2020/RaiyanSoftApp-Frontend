import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { getPageMetadata } from '@/lib/page-seo';
import { createItemListJsonLd, getCanonicalUrl } from '@/lib/site';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export const metadata: Metadata = getPageMetadata('partners');

type PublicPartner = { name?: string; title?: string; description: string };

export default async function PartnersPage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  const partners = await getPublicWebsiteData<PublicPartner>('partners', language);

  return (
    <PublicSimplePage
      seoKey="partners"
      eyebrow={tt('Partners')}
      title={tt('Partnerships that support digital execution.')}
      description={tt('Names and descriptions of approved partners can be managed from the dashboard.')}
    >
      <JsonLd
        id="partners-list-schema"
        data={createItemListJsonLd(
          partners.map((item) => ({
            name: item.name || item.title || '',
            description: item.description,
            url: getCanonicalUrl('/partners'),
          })),
          tt('Raiyan Soft partners'),
        )}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {partners.map((item) => <BasicContentCard key={item.name || item.title} title={item.name || item.title || ''} description={item.description} />)}
      </div>
    </PublicSimplePage>
  );
}
