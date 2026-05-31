import { getWebsiteContentConfig } from '@/features/admin-website/config/website-content-config';
import type { WebsiteContentSection } from '@/features/admin-website/types/website-content';
import { websiteContentFallbacks } from './websiteContentFallbacks';
import { saveWebsiteContentItem } from './websiteContentStore';

export async function seedWebsiteContentSection(section: WebsiteContentSection) {
  const config = getWebsiteContentConfig(section);
  const items = websiteContentFallbacks[section] || [];
  if (!config) throw new Error(`Unknown website section: ${section}`);

  for (const item of items) {
    await saveWebsiteContentItem(config, {
      ...item,
      id: undefined,
      status: 'draft',
      title: item.title,
    });
  }

  return items.length;
}

