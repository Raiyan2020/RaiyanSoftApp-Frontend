import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import { portfolioItems } from '@/lib/public-content';
import { createBreadcrumbJsonLd, createCreativeWorkJsonLd, createPublicMetadata, getCanonicalUrl } from '@/lib/site';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

type PageProps = { params: Promise<{ slug: string }> };
type PublicPortfolioItem = { slug: string; title: string; summary: string; problem?: string; solution?: string; results?: string };

export async function generateStaticParams() {
  return portfolioItems.map((item) => ({ slug: item.slug }));
}

async function getPortfolioItems(language: 'en' | 'ar') {
  return getPublicWebsiteData<PublicPortfolioItem>('apps', language);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const language = await getServerLanguage();
  const items = await getPortfolioItems(language);
  const item = items.find((entry) => entry.slug === slug);
  if (!item) return createPublicMetadata({ title: translateMessage('Work Not Found', language), path: '/portfolio' });
  return createPublicMetadata({ title: item.title, description: item.summary, path: `/portfolio/${item.slug}` });
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  const items = await getPortfolioItems(language);
  const item = items.find((entry) => entry.slug === slug);
  if (!item) notFound();

  return (
    <PublicSimplePage path={`/portfolio/${item.slug}`} eyebrow={tt('Case Study')} title={tt(item.title)} description={tt(item.summary)}>
      <JsonLd
        id={`portfolio-breadcrumbs-${item.slug}`}
        data={createBreadcrumbJsonLd([
          { name: tt('Works'), url: getCanonicalUrl('/portfolio') },
          { name: item.title, url: getCanonicalUrl(`/portfolio/${item.slug}`) },
        ])}
      />
      <JsonLd
        id={`portfolio-creative-work-${item.slug}`}
        data={createCreativeWorkJsonLd(item)}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <BasicContentCard title={tt('Problem')} description={item.problem || tt('Document the starting point and the business or operational challenge.')} />
        <BasicContentCard title={tt('Solution')} description={item.solution || tt('Document the design and technical decisions that led to the solution.')} />
        <BasicContentCard title={tt('Result')} description={item.results || tt('Add approved outcomes and measurable results when they are ready.')} />
      </div>
    </PublicSimplePage>
  );
}
