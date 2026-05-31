export type WebsiteContentStatus = 'draft' | 'published' | 'archived';

export type WebsiteContentSection =
  | 'homepage'
  | 'services'
  | 'apps'
  | 'blog'
  | 'steps'
  | 'faqs'
  | 'pricing'
  | 'testimonials'
  | 'partners'
  | 'team'
  | 'careers'
  | 'legal'
  | 'settings';

export type WebsiteContentFieldType = 'text' | 'textarea' | 'number' | 'url' | 'select' | 'toggle' | 'list';

export interface WebsiteContentField {
  key: string;
  label: string;
  type: WebsiteContentFieldType;
  required?: boolean;
  placeholder?: string;
  description?: string;
  options?: { label: string; value: string }[];
}

export interface WebsiteContentItem {
  id: string;
  title: string;
  slug?: string;
  status: WebsiteContentStatus;
  order: number;
  featured: boolean;
  locale: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  data: Record<string, any>;
  approval?: {
    approvedForPublic?: boolean;
    clientApproved?: boolean;
    reviewedBy?: string;
    reviewedAt?: number;
  };
  createdAt?: number;
  updatedAt?: number;
  publishedAt?: number;
  createdBy?: string;
  updatedBy?: string;
  publishedBy?: string;
}

export interface WebsiteContentForm {
  title: string;
  slug: string;
  status: WebsiteContentStatus;
  order: string;
  featured: boolean;
  locale: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  data: Record<string, any>;
  approvedForPublic: boolean;
  clientApproved: boolean;
}

export interface WebsiteContentConfig {
  section: WebsiteContentSection;
  label: string;
  singularLabel: string;
  description: string;
  collection: string;
  permission: string;
  requiresSlug?: boolean;
  requiresApproval?: boolean;
  singleton?: boolean;
  fields: WebsiteContentField[];
}
