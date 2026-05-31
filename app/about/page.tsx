import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import { createPublicMetadata } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'من نحن',
  description: 'تعرف على رايان سوفت، طريقة العمل، وما الذي يجعل المنتج الرقمي واضحا وقابلا للنمو.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <PublicSimplePage
      eyebrow="من نحن"
      title="نبني منتجات رقمية واضحة وقابلة للنمو"
      description="رايان سوفت شريك تقني يساعد الشركات على تحويل الأفكار إلى تطبيقات ومواقع ومتاجر تعمل بوضوح وتخدم هدفا تجاريا محددا."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <BasicContentCard title="نفهم الهدف" description="نبدأ من قرار العميل وسياق العمل قبل التصميم أو البرمجة." />
        <BasicContentCard title="نصمم المسار" description="نحول الفكرة إلى تجربة استخدام واضحة ومحتوى قابل للقياس." />
        <BasicContentCard title="نطلق بثقة" description="نسلم على مراحل مع اختبار وتحسين قبل وبعد الإطلاق." />
      </div>
    </PublicSimplePage>
  );
}

