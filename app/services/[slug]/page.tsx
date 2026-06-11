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

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return publicServices.map((service) => ({ slug: service.slug }));
}

async function getServices() {
  return getPublicWebsiteData<PublicService>('services');
}

async function getFaqs() {
  const { faqs } = await fetchLandingFaqs('ar');
  return faqs.map((item) => ({ question: item.question, answer: item.answer }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const services = await getServices();
  const service = services.find((item) => item.slug === slug);
  if (!service) return createPublicMetadata({ title: 'الخدمة غير موجودة', path: '/services' });
  return createPublicMetadata({ title: service.title, description: service.description, path: `/services/${service.slug}` });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const services = await getServices();
  const publicFaqs = await getFaqs();
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <PublicLayout seo={{ title: service.title, description: service.description, path: `/services/${service.slug}` }}>
      <JsonLd id={`service-schema-${service.slug}`} data={createServiceJsonLd(service)} />
      <JsonLd
        id={`service-breadcrumbs-${service.slug}`}
        data={createBreadcrumbJsonLd([
          { name: 'الخدمات', url: getCanonicalUrl('/services') },
          { name: service.title, url: getCanonicalUrl(`/services/${service.slug}`) },
        ])}
      />
      <JsonLd id={`service-faq-${service.slug}`} data={createFaqJsonLd(publicFaqs)} />
      <PageHero
        eyebrow="تفاصيل الخدمة"
        title={service.title}
        description={service.description}
        breadcrumbs={[{ label: 'الخدمات', href: '/services' }, { label: service.shortTitle, href: `/services/${service.slug}` }]}
        actions={[{ label: 'اطلب عرض سعر', href: '/quote' }, { label: 'تواصل معنا', href: '/contact', variant: 'secondary' }]}
      />
      <SectionShell title="النتائج المتوقعة">
        <div className="grid gap-4 md:grid-cols-3">
          {(service.outcomes || []).map((outcome) => (
            <div key={outcome} className="rounded-lg border border-cyan-950/10 bg-white p-5 font-black dark:border-white/10 dark:bg-white/5">
              {outcome}
            </div>
          ))}
        </div>
      </SectionShell>
      <SectionShell tone="muted" title="ما الذي يشمله العرض؟">
        <ul className="grid gap-3 md:grid-cols-2">
          {(service.deliverables || []).map((item) => (
            <li key={item} className="rounded-lg bg-white p-4 text-sm font-bold text-slate-700 shadow-sm dark:bg-white/5 dark:text-slate-200">
              {item}
            </li>
          ))}
        </ul>
      </SectionShell>
      <SectionShell title="أسئلة مرتبطة">
        <PublicFaq items={publicFaqs} />
      </SectionShell>
      <CtaBlock
        title="حوّل هذه الخدمة إلى نطاق مشروع واضح."
        description="أرسل تفاصيل مشروعك وسنساعدك على تحديد أفضل نقطة بداية."
        secondaryLabel="احجز استشارة"
        secondaryHref="/consultation"
      />
    </PublicLayout>
  );
}
