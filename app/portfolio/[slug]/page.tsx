import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import { portfolioItems } from '@/lib/public-content';
import { createBreadcrumbJsonLd, createPublicMetadata, getCanonicalUrl, siteConfig } from '@/lib/site';
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
  if (!item) return createPublicMetadata({ title: 'Work not found', path: '/portfolio' });
  return createPublicMetadata({ title: item.title, description: item.summary, path: `/portfolio/${item.slug}` });
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const items = await getPortfolioItems();
  const item = items.find((entry) => entry.slug === slug);
  if (!item) notFound();

  return (
    <PublicSimplePage eyebrow="Case Study" title={item.title} description={item.summary}>
      <JsonLd
        id={`portfolio-breadcrumbs-${item.slug}`}
        data={createBreadcrumbJsonLd([
          { name: 'Portfolio', url: getCanonicalUrl('/portfolio') },
          { name: item.title, url: getCanonicalUrl(`/portfolio/${item.slug}`) },
        ])}
      />
      <JsonLd
        id={`portfolio-creative-work-${item.slug}`}
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: item.title,
          description: item.summary,
          url: getCanonicalUrl(`/portfolio/${item.slug}`),
          creator: {
            '@type': 'Organization',
            name: siteConfig.name,
            url: getCanonicalUrl('/'),
          },
          inLanguage: siteConfig.language,
        }}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <BasicContentCard title="Problem" description={item.problem || 'Document the starting point and the business or operational challenge.'} />
        <BasicContentCard title="Solution" description={item.solution || 'Document the design and technical decisions that led to the solution.'} />
        <BasicContentCard title="Result" description={item.results || 'Add approved outcomes and measurable results when they are ready.'} />
      </div>
    </PublicSimplePage>
  );
}
