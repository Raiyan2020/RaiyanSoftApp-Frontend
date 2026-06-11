"use client";

import { apiService } from './api-service';
import type { WebsiteContentConfig } from '@/features/admin-website/types/website-content';
import type { WebsiteContentItem, WebsiteContentStatus } from '@/features/admin-website/types/website-content';

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
  config: WebsiteContentConfig,
  onChange: (items: WebsiteContentItem[]) => void,
  onError: (error: string) => void
) {
  let cancelled = false;

  (async () => {
    try {
      const response = await apiService.get<{ data: WebsiteContentItem[] } | WebsiteContentItem[]>(
        `website-content/${config.section}`,
        { skipGlobalToast: true }
      );

      if (cancelled) return;
      if (!response.status) {
        onError(response.message || 'Website content management is not available.');
        return;
      }

      const data = response.data as { data: WebsiteContentItem[] } | WebsiteContentItem[];
      const items = Array.isArray(data) ? data : data?.data ?? [];
      onChange(sortWebsiteContent(items.map((item) => mapWebsiteContentDoc(item.id, item))));
    } catch (error: any) {
      if (!cancelled) onError(error?.message || 'Website content management is not available.');
    }
  })();

  return () => {
    cancelled = true;
  };
}

export async function saveWebsiteContentItem(config: WebsiteContentConfig, item: Partial<WebsiteContentItem>): Promise<string> {
  const response = await apiService.post<string>(`website-content/${config.section}`, item, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(response.message || 'Website content management is not available.');
  }

  return response.data;
}

export async function updateWebsiteContentStatus(
  config: WebsiteContentConfig,
  item: WebsiteContentItem,
  status: WebsiteContentStatus
) {
  return saveWebsiteContentItem(config, { ...item, status });
}

export async function deleteWebsiteContentItem(_config: WebsiteContentConfig, _item: WebsiteContentItem) {
  const response = await apiService.delete<unknown>(`website-content/${_config.section}/${_item.id}`, {
    skipGlobalToast: true,
  });
  if (!response.status) {
    throw new Error(response.message || 'Website content management is not available.');
  }
}

export async function isWebsiteSlugAvailable(_config: WebsiteContentConfig, _slug: string, _ignoreId?: string) {
  const response = await apiService.get<{ data: WebsiteContentItem[] } | WebsiteContentItem[]>(
    `website-content/${_config.section}`,
    { skipGlobalToast: true }
  );
  if (!response.status) return true;
  const data = response.data as { data: WebsiteContentItem[] } | WebsiteContentItem[];
  const items = Array.isArray(data) ? data : data?.data ?? [];
  const normalized = _slug.trim().toLowerCase();
  return !items.some((item) => item.id !== _ignoreId && (item.slug || '').trim().toLowerCase() === normalized);
}
