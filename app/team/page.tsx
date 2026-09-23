import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import ClampText from '@/components/ui/clamp-text';
import FallbackImage from '@/components/ui/fallback-image';
import { fetchPublicTeamMembers } from '@/features/landing-page/services/public-landing-api';
import { getPageMetadata } from '@/lib/page-seo';
import { createPeopleListJsonLd } from '@/lib/site';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('team', await getServerLanguage());
}

export default async function TeamPage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  const teamMembers = await fetchPublicTeamMembers(language);

  return (
    <PublicSimplePage
      seoKey="team"
      eyebrow={tt('Our Team')}
      title={tt('Product, design, and development team')}
      description={tt('Team members shown publicly can be managed from the dashboard.')}
    >
      <JsonLd
        id="team-list-schema"
        data={createPeopleListJsonLd(
          teamMembers.map((member) => ({ name: member.name, role: member.role, bio: member.bio || undefined })),
          language,
        )}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <article
              key={member.id}
              className="flex h-full items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm"
            >
              {member.image ? (
                <FallbackImage src={member.image} alt={member.name} className="h-16 w-16 shrink-0 rounded-full object-cover" />
              ) : null}
              <div className="min-w-0">
                <h2 className="text-xl font-black text-[var(--text)]">{member.name}</h2>
                <p className="mt-1 text-sm font-bold text-primary">{member.role}</p>
                {member.bio ? <ClampText lines={3} className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{member.bio}</ClampText> : null}
              </div>
            </article>
          ))
        ) : (
          <BasicContentCard title={tt('Raiyan Soft team')} description={tt('This page will be updated with approved team member names later.')} />
        )}
      </div>
    </PublicSimplePage>
  );
}
