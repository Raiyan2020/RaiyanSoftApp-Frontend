import { apiService, type ApiResponse } from '@/lib/api-service';

export interface AdminProjectSummary {
  id: number | string;
  project_name?: string;
  description?: string;
  status?: string;
  project_status?: string | { value?: string; key?: string; name?: string } | null;
  estimated_duration?: number | string | null;
  project_url?: string | null;
  type?: string | { value?: string; key?: string; name?: string } | null;
  date?: string;
  user?: {
    id?: number | string;
    full_name?: string;
    full_phone?: string;
    email?: string;
  };
}

export interface AdminStage {
  id: number | string;
  project_id?: number | string;
  project?: {
    id?: number | string;
    project_name?: string;
  };
  title?: string;
  description?: string;
  days?: number | string | null;
  status?: string | number | { value?: string | number; key?: string; name?: string } | null;
  admin_ids?: Array<number | string>;
  admins?: Array<{
    id?: number | string;
    name?: string;
    full_name?: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface AdminStagePayload {
  project_id: number | string;
  title: string;
  description?: string;
  days?: number | null;
  status?: string | number;
  admin_ids?: Array<number | string>;
}

export interface AdminProjectPayload {
  project_name?: string;
  estimated_duration?: number | null;
  project_status?: string | null;
  project_url?: string | null;
  type?: string | null;
}

export interface AdminStageProgress {
  id: number | string;
  stage_id?: number | string;
  project_id?: number | string;
  percentage?: number | string;
  progress?: number | string;
  note?: string;
  created_at?: string;
  updated_at?: string;
  admin?: {
    id?: number | string;
    name?: string;
    full_name?: string;
  };
}

export interface AdminStageProgressPayload {
  stage_id: number | string;
  project_id: number | string;
  percentage: number;
  note: string;
}

export interface AdminProjectReport {
  id: number | string;
  project_id?: number | string;
  start_date?: string;
  end_date?: string;
  date_range?: string;
  report_text?: string;
  content?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminReportPayload {
  project_id: number | string;
  start_date: string;
  end_date?: string;
  report_text: string;
}

export interface AdminStageAttachment {
  id: number | string;
  stage_id?: number | string;
  title?: string;
  description?: string;
  reason?: string;
  type?: string | number;
  type_label?: string;
  attachment?: string;
  attachment_url?: string;
  url?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number | string;
  created_at?: string;
  updated_at?: string;
}

export interface AdminStageAttachmentPayload {
  stage_id?: number | string;
  title: string;
  description: string;
  reason: string;
  type: number | string;
  attachment?: File | null;
}

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const nested = (data as { data?: unknown }).data;
    if (Array.isArray(nested)) return nested as T[];
  }
  return [];
}

function hasListShape(data: unknown) {
  return Array.isArray(data) || Boolean(data && typeof data === 'object' && Array.isArray((data as { data?: unknown }).data));
}

function toQueryString(params?: Record<string, string | number | boolean | null | undefined>) {
  if (!params) return '';
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}

function unwrapItem<T>(data: unknown): T | null {
  if (!data) return null;
  if (Array.isArray(data)) return (data[0] as T) || null;
  if (typeof data === 'object') {
    const nested = (data as { data?: unknown }).data;
    if (nested && !Array.isArray(nested)) return nested as T;
  }
  return data as T;
}

function buildStageFormData(payload: AdminStagePayload) {
  const formData = new FormData();
  formData.append('project_id', String(payload.project_id));
  formData.append('title', payload.title);
  formData.append('description', payload.description || '');
  if (payload.days !== undefined && payload.days !== null) {
    formData.append('days', String(payload.days));
  }
  if (payload.status) {
    formData.append('status', String(payload.status));
  }
  payload.admin_ids?.forEach((id, index) => {
    formData.append(`admin_ids[${index}]`, String(id));
  });
  return formData;
}

function buildProgressFormData(payload: AdminStageProgressPayload) {
  const formData = new FormData();
  formData.append('stage_id', String(payload.stage_id));
  formData.append('project_id', String(payload.project_id));
  formData.append('percentage', String(payload.percentage));
  formData.append('note', payload.note);
  return formData;
}

function buildReportFormData(payload: AdminReportPayload) {
  const formData = new FormData();
  formData.append('project_id', String(payload.project_id));
  formData.append('start_date', payload.start_date);
  if (payload.end_date) formData.append('end_date', payload.end_date);
  formData.append('report_text', payload.report_text);
  return formData;
}

function buildAttachmentFormData(payload: AdminStageAttachmentPayload) {
  const formData = new FormData();
  if (payload.stage_id !== undefined && payload.stage_id !== null) {
    formData.append('stage_id', String(payload.stage_id));
  }
  formData.append('title', payload.title);
  formData.append('description', payload.description);
  formData.append('reason', payload.reason);
  formData.append('type', String(payload.type));
  if (payload.attachment) {
    formData.append('attachment', payload.attachment);
  }
  return formData;
}

export async function fetchAdminProject(id: number | string) {
  const response = await apiService.get<AdminProjectSummary | AdminProjectSummary[] | { data?: AdminProjectSummary | AdminProjectSummary[] }>(`admin/projects/${id}`, {
    skipGlobalToast: true,
  });

  if (!response.status || !response.data) {
    throw new Error(getApiErrorMessage(response));
  }

  const list = unwrapList<AdminProjectSummary>(response.data);
  if (list.length > 0) {
    const project = list.find((item) => String(item.id) === String(id)) || list[0];
    if (!project) throw new Error('Project not found.');
    return project;
  }

  const project = unwrapItem<AdminProjectSummary>(response.data);
  if (!project) throw new Error('Project not found.');
  return project;
}

export async function fetchAdminProjects() {
  const response = await apiService.get<AdminProjectSummary[] | { data?: AdminProjectSummary[] }>('admin/projects', {
    skipGlobalToast: true,
  });

  const projects = unwrapList<AdminProjectSummary>(response.data);
  if (!response.status || !hasListShape(response.data)) {
    throw new Error(getApiErrorMessage(response));
  }

  return projects;
}

export async function updateAdminProject(id: number | string, payload: AdminProjectPayload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, String(value));
  });
  formData.append('_method', 'PUT');

  const response = await apiService.post<AdminProjectSummary | { data?: AdminProjectSummary }>(
    `admin/projects/${id}`,
    formData,
    { skipGlobalToast: true }
  );

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return unwrapItem<AdminProjectSummary>(response.data);
}

export async function fetchAdminStages() {
  const response = await apiService.get<AdminStage[] | { data?: AdminStage[] }>('admin/stages', {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return unwrapList<AdminStage>(response.data);
}

export async function fetchAdminStage(id: number | string) {
  const response = await apiService.get<AdminStage | { data?: AdminStage }>(`admin/stages/${id}`, {
    skipGlobalToast: true,
  });

  if (!response.status || !response.data) {
    throw new Error(getApiErrorMessage(response));
  }

  const stage = unwrapItem<AdminStage>(response.data);
  if (!stage) throw new Error('Stage not found.');
  return stage;
}

export async function createAdminStage(payload: AdminStagePayload) {
  const response = await apiService.post<AdminStage>('admin/stages', buildStageFormData(payload), {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data || null;
}

export async function updateAdminStage(id: number | string, payload: AdminStagePayload) {
  const formData = buildStageFormData(payload);
  formData.append('_method', 'PUT');

  const response = await apiService.post<AdminStage>(`admin/stages/${id}`, formData, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data || null;
}

export async function fetchAdminStageProgress(params?: { project_id?: number | string; stage_id?: number | string; per_page?: number }) {
  const response = await apiService.get<AdminStageProgress[] | { data?: AdminStageProgress[] }>(`admin/stage-progress${toQueryString(params)}`, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return unwrapList<AdminStageProgress>(response.data);
}

export async function createAdminStageProgress(payload: AdminStageProgressPayload) {
  const response = await apiService.post<AdminStageProgress>('admin/stage-progress', buildProgressFormData(payload), {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data || null;
}

export async function fetchAdminReports(params?: { project_id?: number | string }) {
  const response = await apiService.get<AdminProjectReport[] | { data?: AdminProjectReport[] }>(`admin/reports${toQueryString(params)}`, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return unwrapList<AdminProjectReport>(response.data);
}

export async function generateAdminReport(projectId: number | string, startDate: string, endDate?: string) {
  const formData = new FormData();
  formData.append('project_id', String(projectId));
  formData.append('start_date', startDate);
  if (endDate) formData.append('end_date', endDate);

  const response = await apiService.post<AdminProjectReport | { report_text?: string; content?: string }>(
    'admin/reports/generate',
    formData,
    { skipGlobalToast: true }
  );

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data || null;
}

export async function createAdminReport(payload: AdminReportPayload) {
  const response = await apiService.post<AdminProjectReport>('admin/reports', buildReportFormData(payload), {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data || null;
}

export async function fetchAdminReport(id: number | string) {
  const response = await apiService.get<AdminProjectReport | { data?: AdminProjectReport }>(`admin/reports/${id}`, {
    skipGlobalToast: true,
  });

  if (!response.status || !response.data) {
    throw new Error(getApiErrorMessage(response));
  }

  const report = unwrapItem<AdminProjectReport>(response.data);
  if (!report) throw new Error('Report not found.');
  return report;
}

export async function deleteAdminReport(id: number | string) {
  const response = await apiService.delete<[] | Record<string, unknown>>(`admin/reports/${id}`, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response;
}

export async function fetchAdminStageAttachments(params?: {
  project_id?: number | string;
  stage_id?: number | string;
  type?: number | string;
  created_by?: number | string;
  per_page?: number;
}) {
  const response = await apiService.get<AdminStageAttachment[] | { data?: AdminStageAttachment[] }>(`admin/stage-attachments${toQueryString(params)}`, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return unwrapList<AdminStageAttachment>(response.data);
}

export async function createAdminStageAttachment(payload: AdminStageAttachmentPayload) {
  const response = await apiService.post<AdminStageAttachment>(
    'admin/stage-attachments',
    buildAttachmentFormData(payload),
    { skipGlobalToast: true }
  );

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data || null;
}

export async function fetchAdminStageAttachment(id: number | string) {
  const response = await apiService.get<AdminStageAttachment | { data?: AdminStageAttachment }>(`admin/stage-attachments/${id}`, {
    skipGlobalToast: true,
  });

  if (!response.status || !response.data) {
    throw new Error(getApiErrorMessage(response));
  }

  const attachment = unwrapItem<AdminStageAttachment>(response.data);
  if (!attachment) throw new Error('Attachment not found.');
  return attachment;
}

export async function updateAdminStageAttachment(id: number | string, payload: AdminStageAttachmentPayload) {
  const formData = buildAttachmentFormData(payload);
  formData.append('_method', 'PUT');

  const response = await apiService.post<AdminStageAttachment>(`admin/stage-attachments/${id}`, formData, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data || null;
}

export async function deleteAdminStageAttachment(id: number | string) {
  const response = await apiService.delete<[] | Record<string, unknown>>(`admin/stage-attachments/${id}`, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response;
}
