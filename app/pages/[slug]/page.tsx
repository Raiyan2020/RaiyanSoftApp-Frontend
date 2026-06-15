import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PublicSimplePage from '@/components/public/public-page-section';
import { fetchLandingPageBySlug } from '@/features/landing-page';
import { createPublicMetadata } from '@/lib/site';

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
  const page = await fetchLandingPageBySlug<LandingPageRecord>(slug, 'ar');

  if (!page) {
    return createPublicMetadata({ title: 'الصفحة غير موجودة', path: `/pages/${slug}` });
  }

  return createPublicMetadata({
    title: page.title,
    description: page.description,
    path: `/pages/${page.slug}`,
  });
}

export default async function LandingPageSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await fetchLandingPageBySlug<LandingPageRecord>(slug, 'ar');

  if (!page) notFound();

  return (
    <PublicSimplePage seoKey="about" eyebrow="صفحات الموقع" title={page.title} description={page.description}>
      <article className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <p>{page.description}</p>
        </div>
      </article>
    </PublicSimplePage>
  );
}
