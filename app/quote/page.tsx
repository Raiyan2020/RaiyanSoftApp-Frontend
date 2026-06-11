import type { Metadata } from 'next';
import PublicLayout from '@/components/public/public-layout';
import PageHero from '@/components/public/page-hero';
import SectionShell from '@/components/public/section-shell';
import PublicInquiryForm from '@/components/public/public-inquiry-form';
import { getPageMetadata, pageSeo } from '@/lib/page-seo';

export const metadata: Metadata = getPageMetadata('quote');

export default function QuotePage() {
  return (
    <PublicLayout seo={pageSeo.quote}>
      <PageHero eyebrow="طلب عرض سعر" title="صف مشروعك لنحدد نطاق البداية" description="املأ النموذج بأهم تفاصيل مشروعك وسنراجعها للرد بعرض سعر مناسب." />
      <SectionShell>
        <PublicInquiryForm mode="quote" />
      </SectionShell>
    </PublicLayout>
  );
}

