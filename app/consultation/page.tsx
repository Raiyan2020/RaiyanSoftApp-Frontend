import type { Metadata } from 'next';
import PublicLayout from '@/components/public/public-layout';
import PageHero from '@/components/public/page-hero';
import SectionShell from '@/components/public/section-shell';
import { BasicContentCard } from '@/components/public/content-cards';
import { getPageMetadata, pageSeo } from '@/lib/page-seo';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export const metadata: Metadata = getPageMetadata('consultation');

export default async function ConsultationPage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);

  return (
    <PublicLayout seo={pageSeo.consultation}>
      <PageHero
        eyebrow={tt('Book a Consultation')}
        title={tt('Book a time to discuss your project')}
        description={tt(
          "This path connects the public site to the current booking experience so the visitor can move clearly to choosing a time.",
        )}
        actions={[
          { label: tt('Go to Booking'), href: '/book' },
          { label: tt('Get a Quote Instead'), href: '/quote', variant: 'secondary' },
        ]}
      />
      <SectionShell>
        <div className="grid gap-4 md:grid-cols-3">
          <BasicContentCard title={tt('We Review the Idea')} description={tt("We start by understanding the goal, the audience, and the project's current stage.")} />
          <BasicContentCard title={tt('We Define the Path')} description={tt('We suggest whether it is best to start with discovery, design, or development.')} />
          <BasicContentCard title={tt('We Clarify the Next Step')} description={tt('You leave the consultation with an initial picture of what to do next.')} />
        </div>
      </SectionShell>
    </PublicLayout>
  );
}

