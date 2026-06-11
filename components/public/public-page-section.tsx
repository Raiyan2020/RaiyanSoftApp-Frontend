import PublicLayout from './public-layout';
import PageHero from './page-hero';
import SectionShell from './section-shell';
import CtaBlock from './cta-block';
import PublicWebPageJsonLd from './public-web-page-json-ld';
import { pageSeo, type PageSeoKey } from '@/lib/page-seo';

type PublicSimplePageProps = {
  eyebrow?: string;
  title: string;
  description: string;
  path?: string;
  seoKey?: PageSeoKey;
  children: React.ReactNode;
  ctaTitle?: string;
  ctaDescription?: string;
};

export default function PublicSimplePage({
  eyebrow,
  title,
  description,
  path,
  seoKey,
  children,
  ctaTitle = 'جاهز نرتب الخطوة التالية؟',
  ctaDescription = 'شاركنا فكرة المشروع وسنقترح المسار الأنسب للبدء بوضوح.',
}: PublicSimplePageProps) {
  const resolvedPath = path ?? (seoKey ? pageSeo[seoKey].path : '/');
  const jsonLdTitle = seoKey ? pageSeo[seoKey].title : title;
  const jsonLdDescription = seoKey ? pageSeo[seoKey].description : description;

  return (
    <PublicLayout>
      <PublicWebPageJsonLd title={jsonLdTitle} description={jsonLdDescription} path={resolvedPath} />
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

