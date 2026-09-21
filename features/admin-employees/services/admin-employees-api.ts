import { apiService, ApiResponse } from '@/lib/api-service';
import {
  AdminEmployee,
  CreateEmployeePayload,
  UpdateEmployeePayload,
} from '../types/admin-employee.types';

/** Backend route uses this typo intentionally. */
const EMPLOYEES_PATH = 'admin/employess';

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

function unwrapList<T>(data: T[] | { data?: T[] } | null | undefined): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray((data as { data?: T[] }).data)) return (data as { data: T[] }).data;
  return [];
}

export async function fetchAdminEmployees() {
  const response = await apiService.get<AdminEmployee[] | { data?: AdminEmployee[] }>(EMPLOYEES_PATH, {
    skipGlobalToast: true,
  });
  const employees = unwrapList(response.data);

  if (!response.status || !Array.isArray(employees)) {
    throw new Error(getApiErrorMessage(response));
  }

  return employees;
}

export async function fetchAdminEmployee(id: number | string) {
  const response = await apiService.get<AdminEmployee>(`${EMPLOYEES_PATH}/${id}`, {
    skipGlobalToast: true,
  });

  if (!response.status || !response.data) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function createAdminEmployee(payload: CreateEmployeePayload) {
  const response = await apiService.post<AdminEmployee>(EMPLOYEES_PATH, payload, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function updateAdminEmployee(id: number | string, payload: UpdateEmployeePayload) {
  const response = await apiService.post<AdminEmployee>(`${EMPLOYEES_PATH}/${id}`, payload, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function deleteAdminEmployee(id: number | string) {
  const response = await apiService.delete<[] | Record<string, unknown>>(`${EMPLOYEES_PATH}/${id}`, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response;
}

export async function toggleAdminEmployeeBlock(id: number | string) {
  const response = await apiService.post<AdminEmployee>(`${EMPLOYEES_PATH}/${id}/toggle-block`, undefined, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}
