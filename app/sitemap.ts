import type { MetadataRoute } from 'next';
import { getCanonicalUrl, publicRoutes } from '@/lib/site';
import { blogPosts, portfolioItems } from '@/lib/public-content';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const dynamicRoutes = [
    ...portfolioItems.map((item) => `/portfolio/${item.slug}`),
    ...blogPosts.map((post) => `/blog/${post.slug}`),
  ];

  return [...publicRoutes, ...dynamicRoutes].map((route) => ({
    url: getCanonicalUrl(route),
    lastModified: now,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
