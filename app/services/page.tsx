import type { Metadata } from 'next';
import PublicLayout from '@/components/public/public-layout';
import PageHero from '@/components/public/page-hero';
import SectionShell from '@/components/public/section-shell';
import CtaBlock from '@/components/public/cta-block';
import { ServiceCard } from '@/components/public/content-cards';
import JsonLd from '@/components/public/json-ld';
import type { PublicService } from '@/lib/public-content';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { getPageMetadata, pageSeo } from '@/lib/page-seo';
import { createServiceCollectionJsonLd } from '@/lib/site';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export const metadata: Metadata = getPageMetadata('services');

export default async function ServicesPage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  const services = await getPublicWebsiteData<PublicService>('services', language);

  return (
    <PublicLayout seo={pageSeo.services}>
      <JsonLd id="services-list-schema" data={createServiceCollectionJsonLd(services, language)} />
      <PageHero
        eyebrow={tt('Services')}
        title={tt('Digital solutions built around a clear goal')}
        description={tt("Choose the service closest to your project stage, or start by requesting a quote and we'll suggest the right path.")}
        actions={[{ label: tt('Get a Quote'), href: '/quote' }, { label: tt('View Our Work'), href: '/portfolio', variant: 'secondary' }]}
      />
      <SectionShell title={tt('Our Core Services')} description={tt('Each service can be delivered separately or as part of a complete product journey.')}>
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => <ServiceCard key={service.slug} service={service} />)}
        </div>
      </SectionShell>
      <CtaBlock title={tt('Need more than one service?')} description={tt('We can arrange a complete scope that starts with discovery and ends with launch and optimization.')} />
    </PublicLayout>
  );
}
