"use client";

import type { WebsiteContentConfig } from '@/features/admin-website/types/website-content';
import type { WebsiteContentItem, WebsiteContentStatus } from '@/features/admin-website/types/website-content';

const unavailableMessage = 'Website content management is not available in the Laravel backend routes yet.';

const sortWebsiteContent = (items: WebsiteContentItem[]) =>
  [...items].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return (b.updatedAt || 0) - (a.updatedAt || 0);
  });

export function mapWebsiteContentDoc(id: string, data: any): WebsiteContentItem {
  return {
    id,
    title: data.title || 'Untitled',
    slug: data.slug || '',
    status: data.status || 'draft',
    order: typeof data.order === 'number' ? data.order : 0,
    featured: Boolean(data.featured),
    locale: data.locale || 'ar',
    seoTitle: data.seoTitle || '',
    seoDescription: data.seoDescription || '',
    ogImage: data.ogImage || '',
    data: data.data || {},
    approval: data.approval || {},
    createdAt: data.createdAt || 0,
    updatedAt: data.updatedAt || 0,
    publishedAt: data.publishedAt || 0,
    createdBy: data.createdBy || '',
    updatedBy: data.updatedBy || '',
    publishedBy: data.publishedBy || '',
  };
}

export function subscribeWebsiteContent(
  _config: WebsiteContentConfig,
  onChange: (items: WebsiteContentItem[]) => void,
  onError: (error: string) => void
) {
  onChange(sortWebsiteContent([]));
  onError(unavailableMessage);
  return () => {};
}

export async function saveWebsiteContentItem(_config: WebsiteContentConfig, _item: Partial<WebsiteContentItem>): Promise<string> {
  throw new Error(unavailableMessage);
}

export async function updateWebsiteContentStatus(
  config: WebsiteContentConfig,
  item: WebsiteContentItem,
  status: WebsiteContentStatus
) {
  return saveWebsiteContentItem(config, { ...item, status });
}

export async function deleteWebsiteContentItem(_config: WebsiteContentConfig, _item: WebsiteContentItem) {
  throw new Error(unavailableMessage);
}

export async function isWebsiteSlugAvailable(_config: WebsiteContentConfig, _slug: string, _ignoreId?: string) {
  return true;
}
