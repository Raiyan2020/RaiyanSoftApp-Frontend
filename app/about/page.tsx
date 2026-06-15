import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import JsonLd from '@/components/public/json-ld';
import PageHtmlContent from '@/features/pages/components/page-html-content';
import { fetchAboutUsServer } from '@/features/pages/services/pages-api';
import type { AboutUsPage } from '@/features/pages/types/page.types';
import { getPageMetadata, pageSeo } from '@/lib/page-seo';
import { createAboutPageJsonLd } from '@/lib/site';

export const metadata: Metadata = getPageMetadata('about');

export default async function AboutPage() {
  let page: AboutUsPage | null = null;

  try {
    page = await fetchAboutUsServer();
  } catch {
    page = null;
  }

  return (
    <PublicSimplePage
      seoKey="about"
      eyebrow="من نحن"
      title={page?.title || 'نبني منتجات رقمية واضحة وقابلة للنمو'}
      description="ريان سوفت شريك تقني يساعد الشركات على تحويل الأفكار إلى تطبيقات ومواقع ومتاجر تعمل بوضوح وتخدم هدفا تجاريا محددا."
    >
      <JsonLd id="about-page-schema" data={createAboutPageJsonLd(pageSeo.about)} />
      <div className="mx-auto max-w-3xl space-y-8">
        <PageHtmlContent
          html={page?.description}
          emptyMessage="About us content is not available yet."
        />
      </div>
    </PublicSimplePage>
  );
}
