import type { Metadata } from 'next';
import FallbackImage from '@/components/ui/fallback-image';
import { notFound } from 'next/navigation';
import PublicSimplePage from '@/components/public/public-page-section';
import { fetchLandingPageBySlug } from '@/features/landing-page';
import { createPublicMetadata } from '@/lib/site';
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
    return createPublicMetadata({ language, title: translateMessage('Page Not Found', language), path: `/pages/${slug}`, noIndex: true });
  }

  return createPublicMetadata({
    language,
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
      <article className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        {page.image ? (
          <div className="relative aspect-[16/9] w-full">
            <FallbackImage src={page.image} alt={page.title} className="absolute inset-0 h-full w-full object-cover" />
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
