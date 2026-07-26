import type { WebsiteContentSection } from '@/features/admin-website/types/website-content';
import { websiteContentFallbacks } from './websiteContentFallbacks';
import { BASE_URL } from './api-service';
import type { AppLanguage } from './language';

export async function getPublicWebsiteContent(section: WebsiteContentSection, language: AppLanguage = 'ar') {
  try {
    const response = await fetch(`${BASE_URL}/website-content/${section}`, {
      headers: { Accept: 'application/json', 'Accept-Language': language },
      cache: 'no-store',
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

export async function getPublicWebsiteData<T>(section: WebsiteContentSection, language: AppLanguage = 'ar'): Promise<T[]> {
  const items = await getPublicWebsiteContent(section, language);
  return items.map((item) => ({ slug: item.slug, title: item.title, ...item.data })) as T[];
}
