import { apiService, ApiResponse } from '@/lib/api-service';
import {
  AdminLeadDetail,
  AdminLeadListItem,
  AdminLeadsFilters,
  AdminLeadsListResult,
  AdminLeadsPagination,
  LeadStatusAction,
} from '../types/admin-lead.types';

function languageHeaders(language: string) {
  return { 'Accept-Language': language };
}

function buildLeadsQuery(filters: AdminLeadsFilters) {
  const params = new URLSearchParams();

  if (filters.name?.trim()) params.set('name', filters.name.trim());
  if (filters.status) params.set('status', String(filters.status));
  if (filters.requestId?.trim()) params.set('requestId', filters.requestId.trim());
  if (filters.page) params.set('page', String(filters.page));

  const query = params.toString();
  return query ? `?${query}` : '';
}

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

export async function fetchAdminLeads(
  filters: AdminLeadsFilters,
  language: string
): Promise<AdminLeadsListResult> {
  const path = `admin/leads${buildLeadsQuery(filters)}`;
  const response = (await apiService.get<AdminLeadListItem[]>(path, {
    headers: languageHeaders(language),
    skipGlobalToast: true,
  })) as ApiResponse<AdminLeadListItem[]> & { pagination?: AdminLeadsPagination };

  if (!response.status || !Array.isArray(response.data)) {
    throw new Error(getApiErrorMessage(response));
  }

  return {
    leads: response.data,
    pagination: response.pagination ?? null,
  };
}

export async function fetchAdminLead(id: number | string, language: string) {
  const response = await apiService.get<AdminLeadDetail>(`admin/leads/${id}`, {
    headers: languageHeaders(language),
    skipGlobalToast: true,
  });

  if (!response.status || !response.data) {
    throw new Error(getApiErrorMessage(response));
  }

  const data = Array.isArray(response.data) ? response.data[0] : response.data;
  if (!data) {
    throw new Error(getApiErrorMessage(response));
  }

  return data;
}

export async function changeAdminLeadStatus(
  id: number | string,
  action: LeadStatusAction
) {
  const formData = new FormData();
  formData.append('action', action);

  const response = await apiService.post<AdminLeadDetail>(`admin/leads/${id}/status`, formData, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}
