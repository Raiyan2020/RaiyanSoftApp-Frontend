import type { Metadata } from 'next';
import PublicLayout from '@/components/public/public-layout';
import PageHero from '@/components/public/page-hero';
import SectionShell from '@/components/public/section-shell';
import { BasicContentCard } from '@/components/public/content-cards';
import { createPublicMetadata } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'حجز استشارة',
  description: 'ابدأ حجز استشارة أولية مع ريان سوفت عبر مسار الحجز المتاح.',
  path: '/consultation',
});

export default function ConsultationPage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="حجز استشارة"
        title="احجز وقتا لمناقشة مشروعك"
        description="يربط هذا المسار بين الموقع العام وتجربة الحجز الحالية حتى يستطيع الزائر الانتقال بوضوح إلى اختيار الموعد."
        actions={[
          { label: 'اذهب إلى الحجز', href: '/book' },
          { label: 'اطلب عرض سعر بدلا من ذلك', href: '/quote', variant: 'secondary' },
        ]}
      />
      <SectionShell>
        <div className="grid gap-4 md:grid-cols-3">
          <BasicContentCard title="نراجع الفكرة" description="نبدأ بفهم الهدف والجمهور والمرحلة الحالية للمشروع." />
          <BasicContentCard title="نحدد المسار" description="نقترح ما إذا كان الأنسب البدء بالاكتشاف أو التصميم أو التطوير." />
          <BasicContentCard title="نوضح الخطوة التالية" description="تخرج من الاستشارة بتصور أولي لما يجب فعله بعد ذلك." />
        </div>
      </SectionShell>
    </PublicLayout>
  );
}

