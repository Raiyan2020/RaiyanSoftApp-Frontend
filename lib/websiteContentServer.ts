import type { WebsiteContentItem, WebsiteContentSection } from '@/features/admin-website/types/website-content';
import { websiteContentFallbacks } from './websiteContentFallbacks';

export async function getPublishedWebsiteContent(section: WebsiteContentSection): Promise<WebsiteContentItem[]> {
  return websiteContentFallbacks[section] || [];
}
