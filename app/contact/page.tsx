import type { Metadata } from 'next';
import PublicLayout from '@/components/public/public-layout';
import PageHero from '@/components/public/page-hero';
import SectionShell from '@/components/public/section-shell';
import PublicInquiryForm from '@/components/public/public-inquiry-form';
import { createPublicMetadata, siteConfig } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'تواصل معنا',
  description: 'تواصل مع ريان سوفت لمناقشة مشروعك الرقمي أو طلب استشارة أولى.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <PublicLayout>
      <PageHero eyebrow="تواصل معنا" title="ابدأ برسالة واضحة وسنرتب الخطوة التالية" description="اكتب تفاصيل مختصرة عن احتياجك وسنراجعها للرد بالمسار الأنسب." />
      <SectionShell>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="space-y-4">
            <div className="rounded-lg border border-cyan-950/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-black text-primary">البريد الإلكتروني</p>
              <p className="mt-2 font-bold text-slate-950 dark:text-white">{siteConfig.email}</p>
            </div>
            <div className="rounded-lg border border-cyan-950/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-black text-primary">الهاتف</p>
              <p className="mt-2 font-bold text-slate-950 dark:text-white" dir="ltr">{siteConfig.phone}</p>
            </div>
          </aside>
          <PublicInquiryForm mode="contact" />
        </div>
      </SectionShell>
    </PublicLayout>
  );
}

