import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import { portfolioItems } from '@/lib/public-content';
import { createBreadcrumbJsonLd, createCreativeWorkJsonLd, createPublicMetadata, getCanonicalUrl } from '@/lib/site';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';

type PageProps = { params: Promise<{ slug: string }> };
type PublicPortfolioItem = { slug: string; title: string; summary: string; problem?: string; solution?: string; results?: string };

export async function generateStaticParams() {
  return portfolioItems.map((item) => ({ slug: item.slug }));
}

async function getPortfolioItems() {
  return getPublicWebsiteData<PublicPortfolioItem>('apps');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const items = await getPortfolioItems();
  const item = items.find((entry) => entry.slug === slug);
  if (!item) return createPublicMetadata({ title: 'العمل غير موجود', path: '/portfolio' });
  return createPublicMetadata({ title: item.title, description: item.summary, path: `/portfolio/${item.slug}` });
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const items = await getPortfolioItems();
  const item = items.find((entry) => entry.slug === slug);
  if (!item) notFound();

  return (
    <PublicSimplePage path={`/portfolio/${item.slug}`} eyebrow="دراسة حالة" title={item.title} description={item.summary}>
      <JsonLd
        id={`portfolio-breadcrumbs-${item.slug}`}
        data={createBreadcrumbJsonLd([
          { name: 'الأعمال', url: getCanonicalUrl('/portfolio') },
          { name: item.title, url: getCanonicalUrl(`/portfolio/${item.slug}`) },
        ])}
      />
      <JsonLd
        id={`portfolio-creative-work-${item.slug}`}
        data={createCreativeWorkJsonLd(item)}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <BasicContentCard title="المشكلة" description={item.problem || 'وثّق نقطة البداية والتحدي التجاري أو التشغيلي.'} />
        <BasicContentCard title="الحل" description={item.solution || 'وثّق قرارات التصميم والتقنية التي قادت إلى الحل.'} />
        <BasicContentCard title="النتيجة" description={item.results || 'أضف النتائج المعتمدة والمؤشرات القابلة للقياس عند توفرها.'} />
      </div>
    </PublicSimplePage>
  );
}
