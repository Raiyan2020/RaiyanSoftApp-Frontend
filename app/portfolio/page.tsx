import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { createPublicMetadata } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'الأعمال',
  description: 'نماذج من أعمال ودراسات حالة ريان سوفت.',
  path: '/portfolio',
});

type PublicPortfolioItem = { slug: string; title: string; summary: string };

export default async function PortfolioPage() {
  const portfolioItems = await getPublicWebsiteData<PublicPortfolioItem>('apps');

  return (
    <PublicSimplePage eyebrow="الأعمال" title="دراسات حالة ومنتجات رقمية" description="هنا تعرض الأعمال المعتمدة وقصص التحول من الفكرة إلى المنتج.">
      <div className="grid gap-4 md:grid-cols-2">
        {portfolioItems.map((item) => (
          <BasicContentCard key={item.slug} title={item.title} description={item.summary} href={`/portfolio/${item.slug}`} label="عرض دراسة الحالة" />
        ))}
      </div>
    </PublicSimplePage>
  );
}
