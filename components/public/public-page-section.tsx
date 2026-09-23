import PublicLayout from './public-layout';
import PageHero from './page-hero';
import SectionShell from './section-shell';
import PublicWebPageJsonLd from './public-web-page-json-ld';
import { pageSeo, type PageSeoKey } from '@/lib/page-seo';

type PublicSimplePageProps = {
  eyebrow?: string;
  title: string;
  description: string;
  path?: string;
  seoKey?: PageSeoKey;
  children: React.ReactNode;
};

export default function PublicSimplePage({
  eyebrow,
  title,
  description,
  path,
  seoKey,
  children,
}: PublicSimplePageProps) {
  const resolvedPath = path ?? (seoKey ? pageSeo[seoKey].path : '/');
  const jsonLdTitle = seoKey ? pageSeo[seoKey].title : title;
  const jsonLdDescription = seoKey ? pageSeo[seoKey].description : description;

  return (
    <PublicLayout>
      <PublicWebPageJsonLd title={jsonLdTitle} description={jsonLdDescription} path={resolvedPath} />
      {/* No hero actions here: the shared footer's CTA closes the page. The
          hero carries breadcrumbs as the orientation cue. */}
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: eyebrow ?? title, href: resolvedPath },
        ]}
      />
      <SectionShell tone="muted">{children}</SectionShell>
    </PublicLayout>
  );
}

