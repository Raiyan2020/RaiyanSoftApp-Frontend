import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { getPageMetadata } from '@/lib/page-seo';
import { createPeopleListJsonLd } from '@/lib/site';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export const metadata: Metadata = getPageMetadata('team');

type PublicTeamMember = { name?: string; title?: string; role: string; bio?: string };

export default async function TeamPage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  const teamMembers = await getPublicWebsiteData<PublicTeamMember>('team', language);

  return (
    <PublicSimplePage
      seoKey="team"
      eyebrow={tt('Our Team')}
      title={tt('Product, design, and development team')}
      description={tt('Team members shown publicly can be managed from the dashboard.')}
    >
      <JsonLd id="team-list-schema" data={createPeopleListJsonLd(teamMembers, language)} />
      <div className="grid gap-4 md:grid-cols-2">
        {teamMembers.map((item) => (
          <BasicContentCard
            key={item.name || item.title}
            title={item.name || item.title || ''}
            description={`${tt(item.role)}${item.bio ? ` - ${tt(item.bio)}` : ''}`}
          />
        ))}
      </div>
    </PublicSimplePage>
  );
}
