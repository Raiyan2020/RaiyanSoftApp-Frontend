import type { Metadata } from 'next';
import LandingPage from '@/screens/Landing';
import JsonLd from '@/components/public/json-ld';
import PublicWebPageJsonLd from '@/components/public/public-web-page-json-ld';
import { getPageMetadata, pageSeo } from '@/lib/page-seo';
import { createWebSiteJsonLd } from '@/lib/site';
import { fetchPublicBlogs } from '@/features/blog/services/blog-api';

export const metadata: Metadata = getPageMetadata('home');

export default async function Page() {
  const homeSeo = pageSeo.home;
  const blogPosts = await fetchPublicBlogs();

  return (
    <>
      <PublicWebPageJsonLd title={homeSeo.title} description={homeSeo.description} path={homeSeo.path} />
      <JsonLd id="website-schema" data={createWebSiteJsonLd()} />
      <LandingPage
        blogPosts={blogPosts.slice(0, 3).map((post) => ({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          category: post.category?.title,
        }))}
      />
    </>
  );
}
