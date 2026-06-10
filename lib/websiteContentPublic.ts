import type { WebsiteContentSection } from '@/features/admin-website/types/website-content';
import { websiteContentFallbacks } from './websiteContentFallbacks';

export async function getPublicWebsiteContent(section: WebsiteContentSection) {
  return websiteContentFallbacks[section] || [];
}

export async function getPublicWebsiteData<T>(section: WebsiteContentSection): Promise<T[]> {
  const items = await getPublicWebsiteContent(section);
  return items.map((item) => ({ slug: item.slug, title: item.title, ...item.data })) as T[];
}
