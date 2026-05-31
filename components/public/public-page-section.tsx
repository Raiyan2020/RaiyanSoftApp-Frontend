import PublicLayout from './public-layout';
import PageHero from './page-hero';
import SectionShell from './section-shell';
import CtaBlock from './cta-block';

type PublicSimplePageProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children: React.ReactNode;
  ctaTitle?: string;
  ctaDescription?: string;
};

export default function PublicSimplePage({
  eyebrow,
  title,
  description,
  children,
  ctaTitle = 'جاهز نرتب الخطوة التالية؟',
  ctaDescription = 'شاركنا فكرة المشروع وسنقترح المسار الأنسب للبدء بوضوح.',
}: PublicSimplePageProps) {
  return (
    <PublicLayout>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={[
          { label: 'اطلب عرض سعر', href: '/quote' },
          { label: 'تواصل معنا', href: '/contact', variant: 'secondary' },
        ]}
      />
      <SectionShell>{children}</SectionShell>
      <CtaBlock title={ctaTitle} description={ctaDescription} />
    </PublicLayout>
  );
}

