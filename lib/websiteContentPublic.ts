import type { WebsiteContentSection } from '@/features/admin-website/types/website-content';
import { websiteContentFallbacks } from './websiteContentFallbacks';
import { BASE_URL } from './api-service';

export async function getPublicWebsiteContent(section: WebsiteContentSection) {
  try {
    const response = await fetch(`${BASE_URL}/website-content/${section}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    });

    if (response.ok) {
      const json = await response.json();
      if (json?.status) {
        const items = Array.isArray(json.data) ? json.data : json.data?.data ?? [];
        return items;
      }
    }
  } catch {
    // Fall back to built-in content below.
  }

  return websiteContentFallbacks[section] || [];
}

export async function getPublicWebsiteData<T>(section: WebsiteContentSection): Promise<T[]> {
  const items = await getPublicWebsiteContent(section);
  return items.map((item) => ({ slug: item.slug, title: item.title, ...item.data })) as T[];
}
