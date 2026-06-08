import { apiService, ApiResponse, getApiBaseUrl } from '@/lib/api-service';
import { UserColor } from '../types/user-colors.types';

export const userColorsKeys = {
  all: ['user-colors'] as const,
};

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

export async function fetchUserColors() {
  const response = await apiService.get<UserColor[]>('user/colors', {
    skipGlobalToast: true,
  });

  if (!response.status || !Array.isArray(response.data)) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function fetchUserColorsServer() {
  const response = await fetch(`${getApiBaseUrl()}/user/colors`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 300 },
  });

  const data = (await response.json()) as ApiResponse<UserColor[]>;

  if (!data.status || !Array.isArray(data.data)) {
    throw new Error(getApiErrorMessage(data));
  }

  return data.data;
}
