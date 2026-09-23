import type { MetadataRoute } from 'next';
import { getCanonicalUrl, publicRoutes } from '@/lib/site';
import { getPublicWebsiteContent } from '@/lib/websiteContentPublic';
import { fetchPublicBlogs, fetchPublicBlogCategories } from '@/features/blog/services/blog-api';

type SitemapEntry = {
  route: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  lastModified?: Date;
};

type TimestampValue = string | number | Date | null | undefined;

function toValidDate(value: TimestampValue): Date | undefined {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value;
  if (typeof value === 'number') {
    const milliseconds = value < 1_000_000_000_000 ? value * 1_000 : value;
    const date = new Date(milliseconds);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
  if (typeof value === 'string' && value.trim()) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
  return undefined;
}

function getLastModified(item: Record<string, unknown>): Date | undefined {
  return (
    toValidDate(item.updatedAt as TimestampValue) ??
    toValidDate(item.updated_at as TimestampValue) ??
    toValidDate(item.publishedAt as TimestampValue) ??
    toValidDate(item.published_at as TimestampValue) ??
    toValidDate(item.createdAt as TimestampValue) ??
    toValidDate(item.created_at as TimestampValue)
  );
}

function routeForSlug(prefix: string, slug: unknown): string | undefined {
  if (typeof slug !== 'string' || !slug.trim()) return undefined;
  return `${prefix}/${encodeURIComponent(slug.trim())}`;
}

async function safelyLoad<T>(loader: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await loader();
  } catch {
    return fallback;
  }
}

function routePriority(route: string): SitemapEntry {
  if (route === '/') {
    return { route, priority: 1, changeFrequency: 'weekly' };
  }
  if (route.startsWith('/blogs/') || route.startsWith('/portfolio/')) {
    return { route, priority: 0.6, changeFrequency: 'monthly' };
  }
  if (route.startsWith('/pages/')) {
    return { route, priority: 0.7, changeFrequency: 'monthly' };
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
  const [{ items: blogPosts }, blogCategories, services, portfolioItems] = await Promise.all([
    safelyLoad(() => fetchPublicBlogs(undefined, { per_page: 1000 }), { items: [], pagination: null }),
    safelyLoad(fetchPublicBlogCategories, []),
    safelyLoad(() => getPublicWebsiteContent('services'), []),
    safelyLoad(() => getPublicWebsiteContent('apps'), []),
  ]);

  const entries = new Map<string, SitemapEntry>();
  const addEntry = (route: string | undefined, lastModified?: Date) => {
    if (!route) return;
    const normalizedRoute = route === '/' ? '/' : `/${route.replace(/^\/+|\/+$/g, '')}`;
    const current = entries.get(normalizedRoute);
    if (current && current.lastModified && (!lastModified || current.lastModified >= lastModified)) return;
    const { priority, changeFrequency } = routePriority(normalizedRoute);
    entries.set(normalizedRoute, { route: normalizedRoute, priority, changeFrequency, lastModified });
  };

  publicRoutes.forEach((route) => addEntry(route));
  services.forEach((service) => addEntry(routeForSlug('/services', service.slug), getLastModified(service as Record<string, unknown>)));
  blogPosts.forEach((post) => addEntry(routeForSlug('/blogs', post.slug), getLastModified(post as unknown as Record<string, unknown>)));
  blogCategories.forEach((category) => addEntry(routeForSlug('/blogs/categories', category.slug), getLastModified(category as unknown as Record<string, unknown>)));
  portfolioItems.forEach((item) => addEntry(routeForSlug('/portfolio', item.slug), getLastModified(item as Record<string, unknown>)));

  return [...entries.values()].map(({ route, priority, changeFrequency, lastModified }) => ({
    url: getCanonicalUrl(route),
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority,
  }));
}
