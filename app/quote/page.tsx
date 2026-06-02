import type { Metadata } from 'next';
import PublicLayout from '@/components/public/public-layout';
import PageHero from '@/components/public/page-hero';
import SectionShell from '@/components/public/section-shell';
import PublicInquiryForm from '@/components/public/public-inquiry-form';
import { createPublicMetadata } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'طلب عرض سعر',
  description: 'اطلب عرض سعر لمشروع تطبيق أو موقع أو متجر إلكتروني مع ريان سوفت.',
  path: '/quote',
});

export default function QuotePage() {
  return (
    <PublicLayout>
      <PageHero eyebrow="طلب عرض سعر" title="صف مشروعك لنحدد نطاق البداية" description="النموذج الحالي يجهز البيانات والتحقق الأولي، وسيتم ربطه بالتخزين الفعلي في Phase D." />
      <SectionShell>
        <PublicInquiryForm mode="quote" />
      </SectionShell>
    </PublicLayout>
  );
}

