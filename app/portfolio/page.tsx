import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { getPageMetadata } from '@/lib/page-seo';
import { createItemListJsonLd, getCanonicalUrl } from '@/lib/site';

export const metadata: Metadata = getPageMetadata('portfolio');

type PublicPortfolioItem = { slug: string; title: string; summary: string };

export default async function PortfolioPage() {
  const portfolioItems = await getPublicWebsiteData<PublicPortfolioItem>('apps');

  return (
    <PublicSimplePage seoKey="portfolio" eyebrow="الأعمال" title="دراسات حالة ومنتجات رقمية" description="هنا تعرض الأعمال المعتمدة وقصص التحول من الفكرة إلى المنتج.">
      <JsonLd
        id="portfolio-list-schema"
        data={createItemListJsonLd(
          portfolioItems.map((item) => ({
            name: item.title,
            description: item.summary,
            url: getCanonicalUrl(`/portfolio/${item.slug}`),
          })),
          'أعمال ريان سوفت',
        )}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {portfolioItems.map((item) => (
          <BasicContentCard key={item.slug} title={item.title} description={item.summary} href={`/portfolio/${item.slug}`} label="عرض دراسة الحالة" />
        ))}
      </div>
    </PublicSimplePage>
  );
}
