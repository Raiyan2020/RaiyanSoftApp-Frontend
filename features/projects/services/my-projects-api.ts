import { apiService, readPagination, type PaginationMeta } from '@/lib/api-service';
import type { StoredProject } from '@/features/lead-project/types/form-question.types';

export type MyProjectsQueryParams = {
  page?: number;
  language?: string;
};

export type MyProjectsListResponse = {
  data: StoredProject[];
  pagination: PaginationMeta | null;
};

function toQueryString(params?: MyProjectsQueryParams) {
  const search = new URLSearchParams();
  if (params?.page) search.set('page', String(params.page));
  const value = search.toString();
  return value ? `?${value}` : '';
}

/** Paginated `user/my-projects` list (the only list caller of that endpoint). */
export async function fetchMyProjectsPaginated(params?: MyProjectsQueryParams): Promise<MyProjectsListResponse> {
  const response = await apiService.get<StoredProject[]>(`user/my-projects${toQueryString(params)}`, {
    ...(params?.language ? { headers: { 'Accept-Language': params.language } } : {}),
    skipGlobalToast: true,
  });

  if (!response.status || !Array.isArray(response.data)) {
    throw new Error(response.message || 'Failed to load projects.');
  }

  return {
    data: response.data,
    pagination: readPagination(response),
  };
}
