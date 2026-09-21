import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { getPageMetadata } from '@/lib/page-seo';
import { createItemListJsonLd, getCanonicalUrl } from '@/lib/site';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export const metadata: Metadata = getPageMetadata('portfolio');

type PublicPortfolioItem = { slug: string; title: string; summary: string };

export default async function PortfolioPage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  const portfolioItems = await getPublicWebsiteData<PublicPortfolioItem>('apps', language);

  return (
    <PublicSimplePage seoKey="portfolio" eyebrow={tt('Works')} title={tt('Case studies and digital products')} description={tt('Approved work and stories of turning ideas into products are shown here.')}>
      <JsonLd
        id="portfolio-list-schema"
        data={createItemListJsonLd(
          portfolioItems.map((item) => ({
            name: item.title,
            description: item.summary,
            url: getCanonicalUrl(`/portfolio/${item.slug}`),
          })),
          tt('Raiyan Soft Portfolio'),
        )}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {portfolioItems.map((item) => (
          <BasicContentCard key={item.slug} title={item.title} description={item.summary} href={`/portfolio/${item.slug}`} label={tt('View Case Study')} />
        ))}
      </div>
    </PublicSimplePage>
  );
}
