import { apiService, type ApiResponse } from '@/lib/api-service';

export type AdminFormQuestionTypeValue = 1 | 2;

export interface AdminFormQuestionType {
  id?: number;
  value?: AdminFormQuestionTypeValue;
  key?: string;
  name?: string;
  label?: string;
}

export interface AdminFormQuestionOption {
  id?: number;
  value?: string | {
    en?: string;
    ar?: string;
  };
  is_active?: boolean | number;
  sort_order?: number;
}

export interface AdminFormQuestion {
  id: number;
  name?: string | {
    en?: string;
    ar?: string;
  };
  type: AdminFormQuestionTypeValue;
  is_active?: boolean | number;
  sort_order?: number;
  options?: AdminFormQuestionOption[];
}

export interface AdminFormQuestionOptionPayload {
  id?: number | string;
  value_en: string;
  value_ar?: string;
  is_active?: boolean;
  sort_order: number;
}

export interface AdminFormQuestionPayload {
  name_en: string;
  name_ar?: string;
  type: AdminFormQuestionTypeValue;
  is_active: boolean;
  sort_order: number;
  options?: AdminFormQuestionOptionPayload[];
}

export interface AdminFormQuestionOrderItem {
  id: number | string;
  sort_order: number;
}

export interface AdminFormQuestionActiveItem {
  id: number | string;
  is_active: boolean;
}

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

function appendBoolean(formData: FormData, key: string, value: boolean) {
  formData.append(key, value ? '1' : '0');
}

export function buildAdminFormQuestionFormData(payload: AdminFormQuestionPayload) {
  const formData = new FormData();
  formData.append('name[en]', payload.name_en);
  formData.append('name[ar]', payload.name_ar || payload.name_en);
  formData.append('type', String(payload.type));
  appendBoolean(formData, 'is_active', payload.is_active);
  formData.append('sort_order', String(payload.sort_order));

  payload.options?.forEach((option, index) => {
    if (option.id) formData.append(`options[${index}][id]`, String(option.id));
    formData.append(`options[${index}][value][en]`, option.value_en);
    formData.append(`options[${index}][value][ar]`, option.value_ar || option.value_en);
    appendBoolean(formData, `options[${index}][is_active]`, option.is_active !== false);
    formData.append(`options[${index}][sort_order]`, String(option.sort_order));
  });

  return formData;
}

export function buildAdminFormQuestionSortOrderFormData(items: AdminFormQuestionOrderItem[]) {
  const formData = new FormData();
  items.forEach((item) => {
    formData.append(`questions[${item.id}]`, String(item.sort_order));
  });
  return formData;
}

export function buildAdminFormQuestionActiveStatusFormData(items: AdminFormQuestionActiveItem[]) {
  const formData = new FormData();
  items.forEach((item) => {
    appendBoolean(formData, `questions[${item.id}]`, item.is_active);
  });
  return formData;
}

export async function fetchAdminFormQuestionTypes() {
  const response = await apiService.get<AdminFormQuestionType[]>('admin/form-questions/types', {
    skipGlobalToast: true,
  });

  if (!response.status || !Array.isArray(response.data)) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function fetchAdminFormQuestions() {
  const response = await apiService.get<AdminFormQuestion[]>('admin/form-questions', {
    skipGlobalToast: true,
  });

  if (!response.status || !Array.isArray(response.data)) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function fetchAdminFormQuestion(id: number | string) {
  const response = await apiService.get<AdminFormQuestion>(`admin/form-questions/${id}`, {
    skipGlobalToast: true,
  });

  if (!response.status || !response.data) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function createAdminFormQuestion(payload: AdminFormQuestionPayload) {
  const response = await apiService.post<AdminFormQuestion>(
    'admin/form-questions',
    buildAdminFormQuestionFormData(payload),
    { skipGlobalToast: true }
  );

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function updateAdminFormQuestion(id: number | string, payload: AdminFormQuestionPayload) {
  const response = await apiService.post<AdminFormQuestion>(
    `admin/form-questions/${id}`,
    buildAdminFormQuestionFormData(payload),
    { skipGlobalToast: true }
  );

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function deleteAdminFormQuestion(id: number | string) {
  const response = await apiService.delete<[] | Record<string, unknown>>(`admin/form-questions/${id}`, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response;
}

export async function updateAdminFormQuestionSortOrder(items: AdminFormQuestionOrderItem[]) {
  const response = await apiService.post<[] | Record<string, unknown>>(
    'admin/form-questions/update-sort-order',
    buildAdminFormQuestionSortOrderFormData(items),
    { skipGlobalToast: true }
  );

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response;
}

export async function updateAdminFormQuestionActiveStatus(items: AdminFormQuestionActiveItem[]) {
  const response = await apiService.post<[] | Record<string, unknown>>(
    'admin/form-questions/update-active-status',
    buildAdminFormQuestionActiveStatusFormData(items),
    { skipGlobalToast: true }
  );

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response;
}
