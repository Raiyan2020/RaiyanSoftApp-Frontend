import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { createPublicMetadata } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'Partners',
  description: 'Technology and strategic partners.',
  path: '/partners',
});

type PublicPartner = { name?: string; title?: string; description: string };

export default async function PartnersPage() {
  const partners = await getPublicWebsiteData<PublicPartner>('partners');

  return (
    <PublicSimplePage eyebrow="Partners" title="Partnerships that support digital delivery" description="Approved partner names and descriptions can be managed from the dashboard.">
      <div className="grid gap-4 md:grid-cols-2">
        {partners.map((item) => <BasicContentCard key={item.name || item.title} title={item.name || item.title || ''} description={item.description} />)}
      </div>
    </PublicSimplePage>
  );
}
