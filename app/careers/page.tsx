import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { getPageMetadata } from '@/lib/page-seo';
import { createJobPostingListJsonLd } from '@/lib/site';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export const metadata: Metadata = getPageMetadata('careers');

type PublicCareer = { slug?: string; title: string; department?: string; location?: string; workType?: string; description: string };

export default async function CareersPage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  const careers = await getPublicWebsiteData<PublicCareer>('careers', language);

  return (
    <PublicSimplePage
      seoKey="careers"
      eyebrow={tt('Careers')}
      title={tt('Join a team building clear digital products')}
      description={tt('Open roles can be published from the admin dashboard.')}
    >
      <JsonLd id="careers-list-schema" data={createJobPostingListJsonLd(careers, language)} />
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
          <BasicContentCard
            title={tt('No open roles')}
            description={tt('This page is ready for future opportunities in design, development, or product management.')}
          />
        )}
      </div>
    </PublicSimplePage>
  );
}
