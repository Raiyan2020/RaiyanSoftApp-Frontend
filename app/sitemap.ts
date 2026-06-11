import type { MetadataRoute } from 'next';
import { getCanonicalUrl, publicRoutes } from '@/lib/site';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { publicServices } from '@/lib/public-content';
import { fetchPublicBlogs, fetchPublicBlogCategories } from '@/features/blog/services/blog-api';

type SitemapEntry = {
  route: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
};

function routePriority(route: string): SitemapEntry {
  if (route === '/') {
    return { route, priority: 1, changeFrequency: 'weekly' };
  }
  if (route.startsWith('/blogs/') || route.startsWith('/portfolio/')) {
    return { route, priority: 0.6, changeFrequency: 'monthly' };
  }
  if (route.startsWith('/services/')) {
    return { route, priority: 0.8, changeFrequency: 'monthly' };
  }
  if (['/contact', '/quote', '/consultation'].includes(route)) {
    return { route, priority: 0.9, changeFrequency: 'weekly' };
  }
  return { route, priority: 0.7, changeFrequency: 'monthly' };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const blogPosts = await fetchPublicBlogs();
  const blogCategories = await fetchPublicBlogCategories();
  const portfolioItems = await getPublicWebsiteData<{ slug: string }>('apps');

  const serviceSlugs = publicServices.map((service) => `/services/${service.slug}`);
  const blogRoutes = blogPosts.map((post) => `/blogs/${post.slug}`);
  const blogCategoryRoutes = blogCategories.map((category) => `/blogs/categories/${category.slug}`);
  const portfolioRoutes = portfolioItems.map((item) => `/portfolio/${item.slug}`);

  const allRoutes = [...publicRoutes, ...serviceSlugs, ...blogRoutes, ...blogCategoryRoutes, ...portfolioRoutes];
  const uniqueRoutes = [...new Set(allRoutes)];

  return uniqueRoutes.map((route) => {
    const { priority, changeFrequency } = routePriority(route);
    return {
      url: getCanonicalUrl(route),
      lastModified: now,
      changeFrequency,
      priority,
    };
  });
}
