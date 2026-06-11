import type { WebsiteContentItem, WebsiteContentSection } from '@/features/admin-website/types/website-content';

export const WEBSITE_CONTENT_API_BASE = '/api/website-content';

export type WebsiteContentApiResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};

export type WebsiteContentApiDocument = WebsiteContentItem & {
  data: Record<string, any>;
};

export type WebsiteContentStore = Record<WebsiteContentSection, WebsiteContentApiDocument[]>;
