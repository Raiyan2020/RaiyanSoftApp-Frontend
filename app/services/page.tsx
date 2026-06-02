import type { Metadata } from 'next';
import PublicLayout from '@/components/public/public-layout';
import PageHero from '@/components/public/page-hero';
import SectionShell from '@/components/public/section-shell';
import CtaBlock from '@/components/public/cta-block';
import { ServiceCard } from '@/components/public/content-cards';
import type { PublicService } from '@/lib/public-content';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { createPublicMetadata } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'الخدمات',
  description: 'خدمات ريان سوفت في تطوير تطبيقات الجوال والمواقع والمتاجر الإلكترونية والهوية وتجربة المستخدم.',
  path: '/services',
});

export default async function ServicesPage() {
  const services = await getPublicWebsiteData<PublicService>('services');

  return (
    <PublicLayout>
      <PageHero
        eyebrow="الخدمات"
        title="حلول رقمية تبنى حول هدف واضح"
        description="اختر الخدمة الأقرب لمرحلة مشروعك، أو ابدأ بطلب عرض سعر لنقترح المسار المناسب."
        actions={[{ label: 'اطلب عرض سعر', href: '/quote' }, { label: 'شاهد الأعمال', href: '/portfolio', variant: 'secondary' }]}
      />
      <SectionShell title="خدماتنا الأساسية" description="كل خدمة يمكن تنفيذها منفصلة أو ضمن رحلة منتج كاملة.">
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => <ServiceCard key={service.slug} service={service} />)}
        </div>
      </SectionShell>
      <CtaBlock title="هل تحتاج أكثر من خدمة؟" description="نستطيع ترتيب نطاق متكامل يبدأ من الاكتشاف وينتهي بالإطلاق والتحسين." />
    </PublicLayout>
  );
}
