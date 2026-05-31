import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { createPublicMetadata } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'Team',
  description: 'Meet the product, design, and development team.',
  path: '/team',
});

type PublicTeamMember = { name?: string; title?: string; role: string; bio?: string };

export default async function TeamPage() {
  const teamMembers = await getPublicWebsiteData<PublicTeamMember>('team');

  return (
    <PublicSimplePage eyebrow="Team" title="A product, design, and development team" description="Public team members can be managed from the dashboard.">
      <div className="grid gap-4 md:grid-cols-2">
        {teamMembers.map((item) => (
          <BasicContentCard key={item.name || item.title} title={item.name || item.title || ''} description={`${item.role}${item.bio ? ` - ${item.bio}` : ''}`} />
        ))}
      </div>
    </PublicSimplePage>
  );
}
