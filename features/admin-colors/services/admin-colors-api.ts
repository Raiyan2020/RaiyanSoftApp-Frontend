import { apiService, ApiResponse } from '@/lib/api-service';
import { AdminColor, CreateColorPayload, UpdateColorPayload } from '../types/admin-color.types';

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

export async function fetchAdminColors() {
  const response = await apiService.get<AdminColor[]>('admin/colors', {
    skipGlobalToast: true,
  });

  if (!response.status || !Array.isArray(response.data)) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function fetchAdminColor(id: number | string) {
  const response = await apiService.get<AdminColor>(`admin/colors/${id}`, {
    skipGlobalToast: true,
  });

  if (!response.status || !response.data) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

function buildColorFormData(payload: CreateColorPayload | UpdateColorPayload) {
  const formData = new FormData();
  formData.append('hex_code', payload.hex_code);
  formData.append('is_active', payload.is_active === false ? '0' : '1');
  return formData;
}

export async function createAdminColor(payload: CreateColorPayload) {
  const response = await apiService.post<AdminColor>('admin/colors', buildColorFormData(payload), {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function updateAdminColor(id: number | string, payload: UpdateColorPayload) {
  const response = await apiService.post<AdminColor>(`admin/colors/${id}`, buildColorFormData(payload), {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function deleteAdminColor(id: number | string) {
  const response = await apiService.delete<[] | Record<string, unknown>>(`admin/colors/${id}`, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response;
}
