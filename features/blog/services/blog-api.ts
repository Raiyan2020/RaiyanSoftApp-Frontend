import { apiService, BASE_URL } from '@/lib/api-service';
import type {
  BlogCategory,
  BlogCategoryDetail,
  BlogCategoryPayload,
  BlogCategoryWithCount,
  BlogDetailItem,
  BlogListItem,
  BlogPayload,
} from '../types/blog.types';

type ApiResponseShape<T> = { data?: T } | T;

function unwrapList<T>(data: ApiResponseShape<T[] | { data?: T[] }> | null | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && 'data' in data) {
    const next = (data as { data?: T[] }).data;
    return Array.isArray(next) ? next : [];
  }
  return [];
}

function unwrapItem<T>(data: ApiResponseShape<T> | null | undefined): T | null {
  if (!data) return null;
  if (typeof data === 'object' && 'data' in data) return (data as { data?: T }).data ?? null;
  return data as T;
}

export async function fetchPublicBlogs(): Promise<BlogListItem[]> {
  const response = await fetch(`${BASE_URL}/user/blogs`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 },
  });
  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.status) return [];
  return unwrapList<BlogListItem>(json.data);
}

export async function fetchPublicBlog(slug: string): Promise<BlogDetailItem | null> {
  const response = await fetch(`${BASE_URL}/user/blogs/${slug}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 },
  });
  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.status) return null;
  return unwrapItem<BlogDetailItem>(json.data);
}

export async function fetchPublicBlogCategories(): Promise<BlogCategory[]> {
  const response = await fetch(`${BASE_URL}/user/blog-categories`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 },
  });
  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.status) return [];
  return unwrapList<BlogCategory>(json.data);
}

export async function fetchPublicBlogCategory(slug: string): Promise<BlogCategory | null> {
  const response = await fetch(`${BASE_URL}/user/blog-categories/${slug}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 },
  });
  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.status) return null;
  return unwrapItem<BlogCategory>(json.data);
}

export async function fetchPublicBlogCategoryBlogs(slug: string): Promise<BlogListItem[]> {
  const response = await fetch(`${BASE_URL}/user/blog-categories/${slug}/blogs`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 },
  });
  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.status) return [];
  return unwrapList<BlogListItem>(json.data);
}

export async function fetchAdminBlogs(params?: { search?: string; category_id?: number | string; per_page?: number }): Promise<BlogListItem[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.category_id !== undefined && params.category_id !== '') query.set('category_id', String(params.category_id));
  if (params?.per_page) query.set('per_page', String(params.per_page));
  const response = await apiService.get<BlogListItem[] | { data: BlogListItem[] }>(`admin/blogs?${query.toString()}`, {
    skipGlobalToast: true,
  });
  if (!response.status) return [];
  return unwrapList<BlogListItem>(response.data as any);
}

export async function fetchAdminBlog(id: number | string): Promise<BlogDetailItem | null> {
  const response = await apiService.get<BlogDetailItem>(`admin/blogs/${id}`, { skipGlobalToast: true });
  if (!response.status) return null;
  return unwrapItem<BlogDetailItem>(response.data as any);
}

export async function createAdminBlog(payload: BlogPayload): Promise<void> {
  const body = new FormData();
  body.append('category_id', String(payload.category_id));
  body.append('title[ar]', payload.title.ar);
  body.append('title[en]', payload.title.en);
  body.append('slug', payload.slug);
  body.append('excerpt[ar]', payload.excerpt.ar);
  body.append('excerpt[en]', payload.excerpt.en);
  body.append('content[ar]', payload.content.ar);
  body.append('content[en]', payload.content.en);
  body.append('is_featured', String(payload.is_featured ? 1 : 0));
  body.append('is_active', String(payload.is_active ? 1 : 0));
  body.append('sort_order', String(payload.sort_order));
  body.append('meta_title[ar]', payload.meta_title?.ar || '');
  body.append('meta_title[en]', payload.meta_title?.en || '');
  body.append('meta_description[ar]', payload.meta_description?.ar || '');
  body.append('meta_description[en]', payload.meta_description?.en || '');
  body.append('og_title[ar]', payload.og_title?.ar || '');
  body.append('og_title[en]', payload.og_title?.en || '');
  body.append('og_description[ar]', payload.og_description?.ar || '');
  body.append('og_description[en]', payload.og_description?.en || '');
  if (payload.image) body.append('image', payload.image);
  if (payload.og_image) body.append('og_image', payload.og_image);
  const response = await apiService.post<unknown>('admin/blogs', body, { skipGlobalToast: true });
  if (!response.status) throw new Error(response.message || 'Failed to save blog.');
}

export async function updateAdminBlog(id: number, payload: BlogPayload): Promise<void> {
  const body = new FormData();
  body.append('category_id', String(payload.category_id));
  body.append('title[ar]', payload.title.ar);
  body.append('title[en]', payload.title.en);
  body.append('slug', payload.slug);
  body.append('excerpt[ar]', payload.excerpt.ar);
  body.append('excerpt[en]', payload.excerpt.en);
  body.append('content[ar]', payload.content.ar);
  body.append('content[en]', payload.content.en);
  body.append('is_featured', String(payload.is_featured ? 1 : 0));
  body.append('is_active', String(payload.is_active ? 1 : 0));
  body.append('sort_order', String(payload.sort_order));
  body.append('meta_title[ar]', payload.meta_title?.ar || '');
  body.append('meta_title[en]', payload.meta_title?.en || '');
  body.append('meta_description[ar]', payload.meta_description?.ar || '');
  body.append('meta_description[en]', payload.meta_description?.en || '');
  body.append('og_title[ar]', payload.og_title?.ar || '');
  body.append('og_title[en]', payload.og_title?.en || '');
  body.append('og_description[ar]', payload.og_description?.ar || '');
  body.append('og_description[en]', payload.og_description?.en || '');
  if (payload.image) body.append('image', payload.image);
  if (payload.og_image) body.append('og_image', payload.og_image);
  const response = await apiService.post<unknown>(`admin/blogs/${id}`, body, { skipGlobalToast: true });
  if (!response.status) throw new Error(response.message || 'Failed to save blog.');
}

export async function deleteAdminBlog(id: number): Promise<void> {
  const response = await apiService.delete<unknown>(`admin/blogs/${id}`, { skipGlobalToast: true });
  if (!response.status) throw new Error(response.message || 'Failed to delete blog.');
}

export async function fetchAdminBlogCategories(params?: { per_page?: number; all?: boolean; search?: string }): Promise<BlogCategoryWithCount[]> {
  const query = new URLSearchParams();
  if (params?.per_page) query.set('per_page', String(params.per_page));
  if (params?.all) query.set('all', '1');
  if (params?.search) query.set('search', params.search);
  const response = await apiService.get<BlogCategoryWithCount[] | { data: BlogCategoryWithCount[] }>(`admin/blog-categories?${query.toString()}`, {
    skipGlobalToast: true,
  });
  if (!response.status) return [];
  return unwrapList<BlogCategoryWithCount>(response.data as any);
}

export async function fetchAdminBlogCategory(id: number | string): Promise<BlogCategoryDetail | null> {
  const response = await apiService.get<BlogCategoryDetail>(`admin/blog-categories/${id}`, { skipGlobalToast: true });
  if (!response.status) return null;
  return unwrapItem<BlogCategoryDetail>(response.data as any);
}

export async function createAdminBlogCategory(payload: BlogCategoryPayload): Promise<void> {
  const body = new FormData();
  body.append('title[ar]', payload.title.ar);
  body.append('title[en]', payload.title.en);
  body.append('slug', payload.slug);
  body.append('description[ar]', payload.description.ar);
  body.append('description[en]', payload.description.en);
  body.append('is_active', String(payload.is_active ? 1 : 0));
  body.append('sort_order', String(payload.sort_order));
  body.append('meta_title[ar]', payload.meta_title?.ar || '');
  body.append('meta_title[en]', payload.meta_title?.en || '');
  body.append('meta_description[ar]', payload.meta_description?.ar || '');
  body.append('meta_description[en]', payload.meta_description?.en || '');
  body.append('og_title[ar]', payload.og_title?.ar || '');
  body.append('og_title[en]', payload.og_title?.en || '');
  body.append('og_description[ar]', payload.og_description?.ar || '');
  body.append('og_description[en]', payload.og_description?.en || '');
  if (payload.image) body.append('image', payload.image);
  if (payload.og_image) body.append('og_image', payload.og_image);
  const response = await apiService.post<unknown>('admin/blog-categories', body, { skipGlobalToast: true });
  if (!response.status) throw new Error(response.message || 'Failed to save blog category.');
}

export async function updateAdminBlogCategory(id: number, payload: BlogCategoryPayload): Promise<void> {
  const body = new FormData();
  body.append('title[ar]', payload.title.ar);
  body.append('title[en]', payload.title.en);
  body.append('slug', payload.slug);
  body.append('description[ar]', payload.description.ar);
  body.append('description[en]', payload.description.en);
  body.append('is_active', String(payload.is_active ? 1 : 0));
  body.append('sort_order', String(payload.sort_order));
  body.append('meta_title[ar]', payload.meta_title?.ar || '');
  body.append('meta_title[en]', payload.meta_title?.en || '');
  body.append('meta_description[ar]', payload.meta_description?.ar || '');
  body.append('meta_description[en]', payload.meta_description?.en || '');
  body.append('og_title[ar]', payload.og_title?.ar || '');
  body.append('og_title[en]', payload.og_title?.en || '');
  body.append('og_description[ar]', payload.og_description?.ar || '');
  body.append('og_description[en]', payload.og_description?.en || '');
  if (payload.image) body.append('image', payload.image);
  if (payload.og_image) body.append('og_image', payload.og_image);
  const response = await apiService.post<unknown>(`admin/blog-categories/${id}`, body, { skipGlobalToast: true });
  if (!response.status) throw new Error(response.message || 'Failed to save blog category.');
}

export async function deleteAdminBlogCategory(id: number): Promise<void> {
  const response = await apiService.delete<unknown>(`admin/blog-categories/${id}`, { skipGlobalToast: true });
  if (!response.status) throw new Error(response.message || 'Failed to delete blog category.');
}
