import { apiService, ApiResponse } from '@/lib/api-service';
import { fetchUserColors } from '@/features/colors/api/user-colors-api';
import { AdminColor, CreateColorPayload } from '../types/admin-color.types';

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

export async function fetchAdminColors() {
  return fetchUserColors();
}

export async function createAdminColor(payload: CreateColorPayload) {
  const response = await apiService.post<AdminColor>('admin/colors', payload, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}
