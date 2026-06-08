import { apiService, ApiResponse, getApiBaseUrl } from '@/lib/api-service';
import { UserSettings } from '../types/user-settings.types';

export const userSettingsKeys = {
  all: ['user-settings'] as const,
};

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

export async function fetchUserSettings() {
  const response = await apiService.get<UserSettings>('user/settings', {
    skipGlobalToast: true,
  });

  if (!response.status || !response.data) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function fetchUserSettingsServer() {
  const response = await fetch(`${getApiBaseUrl()}/user/settings`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 300 },
  });

  const data = (await response.json()) as ApiResponse<UserSettings>;

  if (!data.status || !data.data) {
    throw new Error(getApiErrorMessage(data));
  }

  return data.data;
}
