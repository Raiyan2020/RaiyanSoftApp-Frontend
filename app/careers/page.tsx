import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { createPublicMetadata } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'Careers',
  description: 'Current open roles.',
  path: '/careers',
});

type PublicCareer = { slug?: string; title: string; department?: string; location?: string; workType?: string; description: string };

export default async function CareersPage() {
  const careers = await getPublicWebsiteData<PublicCareer>('careers');

  return (
    <PublicSimplePage eyebrow="Careers" title="Join a team building clear digital products" description="Open roles can be published from the admin dashboard.">
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
          <BasicContentCard title="No open roles" description="This page is ready for future opportunities in design, development, or product management." />
        )}
      </div>
    </PublicSimplePage>
  );
}
