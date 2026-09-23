import { cache } from 'react';
import { apiService, readPagination, BASE_URL, type PaginationMeta } from '@/lib/api-service';
import type { AppLanguage } from '@/lib/language';
import { assertApiOk } from '@/lib/admin-api-error';
import type {
  AdminBlog,
  AdminBlogCategory,
  BlogCategory,
  BlogCategoryPayload,
  BlogDetailItem,
  BlogListItem,
  BlogPayload,
} from '../types/blog.types';

type ApiResponseShape<T> = { data?: T } | T;

/** Public listing endpoints are paginated server-side; callers that need the
 * whole set (sitemap, static params, cross-category counts) pass a large
 * `per_page` instead of paging through — see call sites for the rationale. */
export type PublicListResult<T> = { items: T[]; pagination: PaginationMeta | null };

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

export const fetchPublicBlogs = cache(async function fetchPublicBlogs(
  language: AppLanguage = 'ar',
  params?: { page?: number; per_page?: number },
): Promise<PublicListResult<BlogListItem>> {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    query.set('per_page', String(params?.per_page ?? 15));
    const response = await fetch(`${BASE_URL}/user/blogs?${query.toString()}`, {
      headers: { Accept: 'application/json', 'Accept-Language': language },
      next: { revalidate: 300 },
    });
    const json = await response.json().catch(() => null);
    if (!response.ok || !json?.status) return { items: [], pagination: null };
    return { items: unwrapList<BlogListItem>(json.data), pagination: readPagination(json) };
  } catch {
    return { items: [], pagination: null };
  }
});

export const fetchPublicBlog = cache(async function fetchPublicBlog(slug: string, language: AppLanguage = 'ar'): Promise<BlogDetailItem | null> {
  try {
    const response = await fetch(`${BASE_URL}/user/blogs/${slug}`, {
      headers: { Accept: 'application/json', 'Accept-Language': language },
      next: { revalidate: 300 },
    });
    const json = await response.json().catch(() => null);
    if (!response.ok || !json?.status) return null;
    return unwrapItem<BlogDetailItem>(json.data);
  } catch {
    // The public site must still build/render when the content API is unreachable.
    return null;
  }
});

export const fetchPublicBlogCategories = cache(async function fetchPublicBlogCategories(language: AppLanguage = 'ar'): Promise<BlogCategory[]> {
  try {
    const response = await fetch(`${BASE_URL}/user/blog-categories`, {
      headers: { Accept: 'application/json', 'Accept-Language': language },
      next: { revalidate: 300 },
    });
    const json = await response.json().catch(() => null);
    if (!response.ok || !json?.status) return [];
    return unwrapList<BlogCategory>(json.data);
  } catch {
    // The public site must still build/render when the content API is unreachable.
    return [];
  }
});

export const fetchPublicBlogCategory = cache(async function fetchPublicBlogCategory(slug: string, language: AppLanguage = 'ar'): Promise<BlogCategory | null> {
  try {
    const response = await fetch(`${BASE_URL}/user/blog-categories/${slug}`, {
      headers: { Accept: 'application/json', 'Accept-Language': language },
      next: { revalidate: 300 },
    });
    const json = await response.json().catch(() => null);
    if (!response.ok || !json?.status) return null;
    return unwrapItem<BlogCategory>(json.data);
  } catch {
    // The public site must still build/render when the content API is unreachable.
    return null;
  }
});

export const fetchPublicBlogCategoryBlogs = cache(async function fetchPublicBlogCategoryBlogs(
  slug: string,
  language: AppLanguage = 'ar',
  params?: { page?: number; per_page?: number },
): Promise<PublicListResult<BlogListItem>> {
  try {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    query.set('per_page', String(params?.per_page ?? 15));
    const response = await fetch(`${BASE_URL}/user/blog-categories/${slug}/blogs?${query.toString()}`, {
      headers: { Accept: 'application/json', 'Accept-Language': language },
      next: { revalidate: 300 },
    });
    const json = await response.json().catch(() => null);
    if (!response.ok || !json?.status) return { items: [], pagination: null };
    return { items: unwrapList<BlogListItem>(json.data), pagination: readPagination(json) };
  } catch {
    // The public site must still build/render when the content API is unreachable.
    return { items: [], pagination: null };
  }
});

function appendBilingual(body: FormData, key: string, value?: { ar: string; en: string }) {
  body.append(`${key}[ar]`, value?.ar || '');
  body.append(`${key}[en]`, value?.en || '');
}

function appendSeo(body: FormData, payload: BlogPayload | BlogCategoryPayload) {
  appendBilingual(body, 'meta_title', payload.meta_title);
  appendBilingual(body, 'meta_description', payload.meta_description);
  appendBilingual(body, 'og_title', payload.og_title);
  appendBilingual(body, 'og_description', payload.og_description);
  if (payload.image) body.append('image', payload.image);
  if (payload.og_image) body.append('og_image', payload.og_image);
}

function buildBlogFormData(payload: BlogPayload): FormData {
  const body = new FormData();
  body.append('category_id', String(payload.category_id));
  appendBilingual(body, 'title', payload.title);
  body.append('slug', payload.slug);
  appendBilingual(body, 'excerpt', payload.excerpt);
  appendBilingual(body, 'content', payload.content);
  body.append('is_featured', payload.is_featured ? '1' : '0');
  body.append('is_active', payload.is_active ? '1' : '0');
  // Sent as UTC ISO so the backend (UTC) stores the moment the admin picked locally.
  body.append('published_at', payload.published_at ? new Date(payload.published_at).toISOString() : '');
  body.append('sort_order', String(payload.sort_order));
  appendSeo(body, payload);
  return body;
}

function buildBlogCategoryFormData(payload: BlogCategoryPayload): FormData {
  const body = new FormData();
  appendBilingual(body, 'title', payload.title);
  body.append('slug', payload.slug);
  appendBilingual(body, 'description', payload.description);
  body.append('is_active', payload.is_active ? '1' : '0');
  body.append('sort_order', String(payload.sort_order));
  appendSeo(body, payload);
  return body;
}

export async function fetchAdminBlogs(params?: { search?: string; category_id?: number | string; page?: number; per_page?: number }): Promise<{ items: AdminBlog[]; pagination: PaginationMeta | null }> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.category_id !== undefined && params.category_id !== '') query.set('category_id', String(params.category_id));
  if (params?.page) query.set('page', String(params.page));
  if (params?.per_page) query.set('per_page', String(params.per_page));
  const response = await apiService.get<AdminBlog[] | { data: AdminBlog[] }>(`admin/blogs?${query.toString()}`, {
    skipGlobalToast: true,
  });
  if (!response.status) return { items: [], pagination: null };
  return { items: unwrapList<AdminBlog>(response.data), pagination: readPagination(response) };
}

export async function createAdminBlog(payload: BlogPayload): Promise<void> {
  assertApiOk(await apiService.post<unknown>('admin/blogs', buildBlogFormData(payload), { skipGlobalToast: true }));
}

export async function updateAdminBlog(id: number, payload: BlogPayload): Promise<void> {
  assertApiOk(await apiService.post<unknown>(`admin/blogs/${id}`, buildBlogFormData(payload), { skipGlobalToast: true }));
}

export async function deleteAdminBlog(id: number): Promise<void> {
  // The shared client toasts delete success/failure itself.
  assertApiOk(await apiService.delete<unknown>(`admin/blogs/${id}`));
}

export async function fetchAdminBlogCategories(params?: { per_page?: number; all?: boolean; search?: string }): Promise<AdminBlogCategory[]> {
  const query = new URLSearchParams();
  if (params?.per_page) query.set('per_page', String(params.per_page));
  if (params?.all) query.set('all', '1');
  if (params?.search) query.set('search', params.search);
  const response = await apiService.get<AdminBlogCategory[] | { data: AdminBlogCategory[] }>(`admin/blog-categories?${query.toString()}`, {
    skipGlobalToast: true,
  });
  if (!response.status) return [];
  return unwrapList<AdminBlogCategory>(response.data);
}

export async function createAdminBlogCategory(payload: BlogCategoryPayload): Promise<void> {
  assertApiOk(await apiService.post<unknown>('admin/blog-categories', buildBlogCategoryFormData(payload), { skipGlobalToast: true }));
}

export async function updateAdminBlogCategory(id: number, payload: BlogCategoryPayload): Promise<void> {
  assertApiOk(await apiService.post<unknown>(`admin/blog-categories/${id}`, buildBlogCategoryFormData(payload), { skipGlobalToast: true }));
}

export async function deleteAdminBlogCategory(id: number): Promise<void> {
  assertApiOk(await apiService.delete<unknown>(`admin/blog-categories/${id}`));
}
