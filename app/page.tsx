import type { Metadata } from 'next';
import LandingPage from '@/screens/Landing';
import JsonLd from '@/components/public/json-ld';
import PublicWebPageJsonLd from '@/components/public/public-web-page-json-ld';
import { getPageMetadata, pageSeo } from '@/lib/page-seo';
import { createWebSiteJsonLd } from '@/lib/site';
import { fetchPublicBlogs } from '@/features/blog/services/blog-api';
import { fetchLandingHome } from '@/features/landing-page';
import { getServerLanguage } from '@/lib/language.server';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('home', await getServerLanguage());
}

export default async function Page() {
  const homeSeo = pageSeo.home;
  const language = await getServerLanguage();
  const [{ items: blogPosts }, landingHome] = await Promise.all([
    fetchPublicBlogs(language, { per_page: 3 }),
    fetchLandingHome(language),
  ]);

  return (
    <>
      <PublicWebPageJsonLd title={homeSeo.title} description={homeSeo.description} path={homeSeo.path} />
      <JsonLd id="website-schema" data={createWebSiteJsonLd()} />
      <LandingPage
        homeData={landingHome}
        blogPosts={blogPosts.map((post) => ({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          category: post.category?.title,
        }))}
      />
    </>
  );
}
