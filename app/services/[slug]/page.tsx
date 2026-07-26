import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PublicLayout from '@/components/public/public-layout';
import PageHero from '@/components/public/page-hero';
import SectionShell from '@/components/public/section-shell';
import CtaBlock from '@/components/public/cta-block';
import PublicFaq from '@/components/public/public-faq';
import JsonLd from '@/components/public/json-ld';
import { createBreadcrumbJsonLd, createFaqJsonLd, createPublicMetadata, createServiceJsonLd, getCanonicalUrl } from '@/lib/site';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { fetchLandingFaqs } from '@/features/landing-page';
import { publicServices, type PublicService } from '@/lib/public-content';
import { getServerLanguage } from '@/lib/language.server';
import { translateMessage } from '@/lib/i18n-utils';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return publicServices.map((service) => ({ slug: service.slug }));
}

async function getServices(language: 'en' | 'ar') {
  return getPublicWebsiteData<PublicService>('services', language);
}

async function getFaqs() {
  const { faqs } = await fetchLandingFaqs(await getServerLanguage());
  return faqs.map((item) => ({ question: item.question, answer: item.answer }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const language = await getServerLanguage();
  const services = await getServices(language);
  const service = services.find((item) => item.slug === slug);
  if (!service) return createPublicMetadata({ title: translateMessage('Service Not Found', language), path: '/services' });
  return createPublicMetadata({ title: service.title, description: service.description, path: `/services/${service.slug}` });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  const services = await getServices(language);
  const publicFaqs = await getFaqs();
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <PublicLayout seo={{ title: service.title, description: service.description, path: `/services/${service.slug}` }}>
      <JsonLd id={`service-schema-${service.slug}`} data={createServiceJsonLd(service)} />
      <JsonLd
        id={`service-breadcrumbs-${service.slug}`}
        data={createBreadcrumbJsonLd([
          { name: tt('Services'), url: getCanonicalUrl('/services') },
          { name: service.title, url: getCanonicalUrl(`/services/${service.slug}`) },
        ])}
      />
      <JsonLd id={`service-faq-${service.slug}`} data={createFaqJsonLd(publicFaqs)} />
      <PageHero
        eyebrow={tt('Service Details')}
        title={tt(service.title)}
        description={tt(service.description)}
        breadcrumbs={[{ label: tt('Services'), href: '/services' }, { label: tt(service.shortTitle), href: `/services/${service.slug}` }]}
        actions={[{ label: tt('Get a Quote'), href: '/quote' }, { label: tt('Contact Us'), href: '/contact', variant: 'secondary' }]}
      />
      <SectionShell title={tt('Expected Outcomes')}>
        <div className="grid gap-4 md:grid-cols-3">
          {(service.outcomes || []).map((outcome) => (
            <div key={outcome} className="rounded-lg border border-cyan-950/10 bg-white p-5 font-black dark:border-white/10 dark:bg-white/5">
              {tt(outcome)}
            </div>
          ))}
        </div>
      </SectionShell>
      <SectionShell tone="muted" title={tt("What's included in the offer?")}>
        <ul className="grid gap-3 md:grid-cols-2">
          {(service.deliverables || []).map((item) => (
            <li key={item} className="rounded-lg bg-white p-4 text-sm font-bold text-slate-700 shadow-sm dark:bg-white/5 dark:text-slate-200">
              {tt(item)}
            </li>
          ))}
        </ul>
      </SectionShell>
      <SectionShell title={tt('Related Questions')}>
        <PublicFaq items={publicFaqs} />
      </SectionShell>
      <CtaBlock
        title={tt('Turn this service into a clear project scope.')}
        description={tt("Send us your project details and we'll help you identify the best starting point.")}
        secondaryLabel={tt('Book a Consultation')}
        secondaryHref="/consultation"
      />
    </PublicLayout>
  );
}
