import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { getPageMetadata } from '@/lib/page-seo';
import { createPeopleListJsonLd } from '@/lib/site';

export const metadata: Metadata = getPageMetadata('team');

type PublicTeamMember = { name?: string; title?: string; role: string; bio?: string };

export default async function TeamPage() {
  const teamMembers = await getPublicWebsiteData<PublicTeamMember>('team');

  return (
    <PublicSimplePage seoKey="team" eyebrow="فريق العمل" title="فريق منتج، تصميم، وتطوير" description="يمكن إدارة أعضاء الفريق المعروضين علناً من لوحة التحكم.">
      <JsonLd id="team-list-schema" data={createPeopleListJsonLd(teamMembers)} />
      <div className="grid gap-4 md:grid-cols-2">
        {teamMembers.map((item) => (
          <BasicContentCard key={item.name || item.title} title={item.name || item.title || ''} description={`${item.role}${item.bio ? ` - ${item.bio}` : ''}`} />
        ))}
      </div>
    </PublicSimplePage>
  );
}
