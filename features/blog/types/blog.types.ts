export interface BlogCategorySeo {
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string | null;
}

export interface BlogCategory {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  is_active?: boolean;
  seo?: BlogCategorySeo;
}

export interface BlogSeo {
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string | null;
}

export interface BlogListItem {
  id: number;
  category_id: number | null;
  category: BlogCategory | null;
  title: string;
  slug: string;
  excerpt: string;
  image: string | null;
  is_featured: boolean;
  published_at: string | null;
  sort_order: number;
  created_at: string | null;
}

export interface BlogDetailItem extends BlogListItem {
  content: string;
  updated_at: string | null;
  seo: BlogSeo;
  schema_json_ld?: Record<string, any>;
  related_blogs?: BlogListItem[];
}

export interface BlogCategoryDetail {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  seo?: BlogCategorySeo;
}

export interface BlogCategoryWithCount extends BlogCategoryDetail {
  count?: number;
  is_active?: boolean;
}

export interface BlogCategoryPayload {
  title: { ar: string; en: string };
  slug: string;
  description: { ar: string; en: string };
  image?: File | null;
  is_active: boolean;
  sort_order: number;
  meta_title?: { ar: string; en: string };
  meta_description?: { ar: string; en: string };
  og_title?: { ar: string; en: string };
  og_description?: { ar: string; en: string };
  og_image?: File | null;
}

export interface BlogPayload {
  category_id: number;
  title: { ar: string; en: string };
  slug: string;
  excerpt: { ar: string; en: string };
  content: { ar: string; en: string };
  image?: File | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  meta_title?: { ar: string; en: string };
  meta_description?: { ar: string; en: string };
  og_title?: { ar: string; en: string };
  og_description?: { ar: string; en: string };
  og_image?: File | null;
}
