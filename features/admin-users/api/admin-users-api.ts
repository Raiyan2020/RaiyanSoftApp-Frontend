import { apiService, type ApiResponse } from '@/lib/api-service';

export type AdminApiUser = {
  id: number;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  country_code?: string;
  user_code?: string;
  registered?: string;
  is_block?: boolean;
};

export type AdminUsersFilters = {
  name?: string;
  email?: string;
  phone?: string;
};

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

function toQueryString(filters: AdminUsersFilters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    const normalized = value?.trim();
    if (normalized) params.set(key, normalized);
  });

  const query = params.toString();
  return query ? `?${query}` : '';
}

export async function fetchAdminUsers(filters: AdminUsersFilters = {}) {
  const response = await apiService.get<AdminApiUser[]>(`admin/users${toQueryString(filters)}`, {
    skipGlobalToast: true,
  });

  if (!response.status || !Array.isArray(response.data)) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function toggleAdminUserBlock(id: number | string) {
  const response = await apiService.post<AdminApiUser>(`admin/users/${id}/toggle-block`, undefined, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}
