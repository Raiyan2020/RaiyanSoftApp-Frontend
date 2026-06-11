import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { getPageMetadata } from '@/lib/page-seo';
import { createJobPostingListJsonLd } from '@/lib/site';

export const metadata: Metadata = getPageMetadata('careers');

type PublicCareer = { slug?: string; title: string; department?: string; location?: string; workType?: string; description: string };

export default async function CareersPage() {
  const careers = await getPublicWebsiteData<PublicCareer>('careers');

  return (
    <PublicSimplePage seoKey="careers" eyebrow="الوظائف" title="انضم إلى فريق يبني منتجات رقمية واضحة" description="يمكن نشر الوظائف المتاحة من لوحة التحكم.">
      <JsonLd id="careers-list-schema" data={createJobPostingListJsonLd(careers)} />
      <div className="grid gap-4 md:grid-cols-2">
        {careers.length > 0 ? (
          careers.map((career) => (
            <BasicContentCard
              key={career.slug || career.title}
              title={career.title}
              description={`${career.department || ''} ${career.location || ''} ${career.workType || ''} - ${career.description}`.trim()}
            />
          ))
        ) : (
          <BasicContentCard title="لا توجد وظائف متاحة حالياً" description="هذه الصفحة جاهزة لعرض فرص مستقبلية في التصميم، التطوير، أو إدارة المنتج." />
        )}
      </div>
    </PublicSimplePage>
  );
}
