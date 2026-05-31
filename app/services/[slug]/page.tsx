import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PublicLayout from '@/components/public/public-layout';
import PageHero from '@/components/public/page-hero';
import SectionShell from '@/components/public/section-shell';
import CtaBlock from '@/components/public/cta-block';
import PublicFaq from '@/components/public/public-faq';
import JsonLd from '@/components/public/json-ld';
import { publicFaqs, publicServices, type PublicService } from '@/lib/public-content';
import { createBreadcrumbJsonLd, createFaqJsonLd, createPublicMetadata, createServiceJsonLd, getCanonicalUrl } from '@/lib/site';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return publicServices.map((service) => ({ slug: service.slug }));
}

async function getServices() {
  return getPublicWebsiteData<PublicService>('services');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const services = await getServices();
  const service = services.find((item) => item.slug === slug);
  if (!service) return createPublicMetadata({ title: 'Service not found', path: '/services' });
  return createPublicMetadata({ title: service.title, description: service.description, path: `/services/${service.slug}` });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const services = await getServices();
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <PublicLayout>
      <JsonLd id={`service-schema-${service.slug}`} data={createServiceJsonLd(service)} />
      <JsonLd
        id={`service-breadcrumbs-${service.slug}`}
        data={createBreadcrumbJsonLd([
          { name: 'Services', url: getCanonicalUrl('/services') },
          { name: service.title, url: getCanonicalUrl(`/services/${service.slug}`) },
        ])}
      />
      <JsonLd id={`service-faq-${service.slug}`} data={createFaqJsonLd(publicFaqs)} />
      <PageHero
        eyebrow="Service Details"
        title={service.title}
        description={service.description}
        breadcrumbs={[{ label: 'Services', href: '/services' }, { label: service.shortTitle, href: `/services/${service.slug}` }]}
        actions={[{ label: 'Request a Quote', href: '/quote' }, { label: 'Contact Us', href: '/contact', variant: 'secondary' }]}
      />
      <SectionShell title="Expected Outcomes">
        <div className="grid gap-4 md:grid-cols-3">
          {(service.outcomes || []).map((outcome) => (
            <div key={outcome} className="rounded-lg border border-cyan-950/10 bg-white p-5 font-black dark:border-white/10 dark:bg-white/5">
              {outcome}
            </div>
          ))}
        </div>
      </SectionShell>
      <SectionShell tone="muted" title="What Is Included?">
        <ul className="grid gap-3 md:grid-cols-2">
          {(service.deliverables || []).map((item) => (
            <li key={item} className="rounded-lg bg-white p-4 text-sm font-bold text-slate-700 shadow-sm dark:bg-white/5 dark:text-slate-200">
              {item}
            </li>
          ))}
        </ul>
      </SectionShell>
      <SectionShell title="Related Questions">
        <PublicFaq items={publicFaqs} />
      </SectionShell>
      <CtaBlock
        title="Turn this service into a clear project scope."
        description="Send us your project details and we will help you shape the best starting point."
        secondaryLabel="Book a Consultation"
        secondaryHref="/consultation"
      />
    </PublicLayout>
  );
}
