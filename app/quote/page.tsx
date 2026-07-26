import type { Metadata } from 'next';
import PublicLayout from '@/components/public/public-layout';
import PageHero from '@/components/public/page-hero';
import SectionShell from '@/components/public/section-shell';
import PublicInquiryForm from '@/components/public/public-inquiry-form';
import { getPageMetadata, pageSeo } from '@/lib/page-seo';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export const metadata: Metadata = getPageMetadata('quote');

export default async function QuotePage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);

  return (
    <PublicLayout seo={pageSeo.quote}>
      <PageHero
        eyebrow={tt('Get a Quote')}
        title={tt('Describe your project so we can define a starting scope')}
        description={tt('Fill in the form with your project details and we will review it to respond with a suitable quote.')}
      />
      <SectionShell>
        <PublicInquiryForm mode="quote" />
      </SectionShell>
    </PublicLayout>
  );
}

