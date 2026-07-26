import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import PublicSimplePage from '@/components/public/public-page-section';
import { fetchLandingPageBySlug } from '@/features/landing-page';
import { createBreadcrumbJsonLd, createPublicMetadata, getCanonicalUrl } from '@/lib/site';
import JsonLd from '@/components/public/json-ld';
import { getServerLanguage } from '@/lib/language.server';
import { translateMessage } from '@/lib/i18n-utils';

type PageProps = {
  params: Promise<{ slug: string }>;
};

type LandingPageRecord = {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string | null;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const language = await getServerLanguage();
  const page = await fetchLandingPageBySlug<LandingPageRecord>(slug, language);

  if (!page) {
    return createPublicMetadata({ title: translateMessage('Page Not Found', language), path: `/pages/${slug}` });
  }

  return createPublicMetadata({
    title: page.title,
    description: page.description,
    path: `/pages/${page.slug}`,
    image: page.image || undefined,
  });
}

export default async function LandingPageSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  const page = await fetchLandingPageBySlug<LandingPageRecord>(slug, language);

  if (!page) notFound();

  return (
    <PublicSimplePage seoKey="about" eyebrow={tt('Site Pages')} title={page.title} description={page.description}>
      <JsonLd
        id={`landing-page-breadcrumbs-${page.slug}`}
        data={createBreadcrumbJsonLd([
          { name: tt('Home'), url: getCanonicalUrl('/') },
          { name: tt('Site Pages'), url: getCanonicalUrl('/pages') },
          { name: page.title, url: getCanonicalUrl(`/pages/${page.slug}`) },
        ])}
      />
      <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
        {page.image ? (
          <div className="relative aspect-[16/9] w-full">
            <Image src={page.image} alt={page.title} fill className="object-cover" />
          </div>
        ) : null}
        <div className="p-6 sm:p-8">
          <div className="prose prose-slate max-w-none dark:prose-invert">
            <p>{page.description}</p>
          </div>
        </div>
      </article>
    </PublicSimplePage>
  );
}
