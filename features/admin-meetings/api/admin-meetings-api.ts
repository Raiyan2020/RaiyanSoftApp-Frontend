import { apiService, ApiResponse } from '@/lib/api-service';
import {
  AdminMeeting,
  AdminMeetingsFilters,
  AdminMeetingsListResult,
  MeetingSettingsPayload,
  MeetingsPagination,
  TimeSlotsConfig,
} from '@/features/meetings/types/meeting.types';

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

function buildMeetingsQuery(filters: AdminMeetingsFilters) {
  const params = new URLSearchParams();
  if (filters.name?.trim()) params.set('name', filters.name.trim());
  if (filters.email?.trim()) params.set('email', filters.email.trim());
  if (filters.phone?.trim()) params.set('phone', filters.phone.trim());
  if (filters.status) params.set('status', String(filters.status));
  if (filters.page) params.set('page', String(filters.page));
  const query = params.toString();
  return query ? `?${query}` : '';
}

export async function fetchAdminMeetings(filters: AdminMeetingsFilters): Promise<AdminMeetingsListResult> {
  const path = `admin/meetings${buildMeetingsQuery(filters)}`;
  const response = (await apiService.get<AdminMeeting[]>(path, {
    skipGlobalToast: true,
  })) as ApiResponse<AdminMeeting[]> & { pagination?: MeetingsPagination };

  if (!response.status || !Array.isArray(response.data)) {
    throw new Error(getApiErrorMessage(response));
  }

  return {
    meetings: response.data,
    pagination: response.pagination ?? null,
  };
}

export async function approveAdminMeeting(id: number | string) {
  const response = await apiService.post<AdminMeeting>(`admin/meetings/${id}/approve`, undefined, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function rejectAdminMeeting(id: number | string) {
  const response = await apiService.post<AdminMeeting>(`admin/meetings/${id}/reject`, undefined, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function fetchAdminTimeSlots() {
  const response = await apiService.get<TimeSlotsConfig>('admin/settings/time-slots', {
    skipGlobalToast: true,
  });

  if (!response.status || !response.data) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function saveAdminTimeSlots(config: TimeSlotsConfig) {
  const response = await apiService.post<TimeSlotsConfig>('admin/settings/time-slots', config, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response;
}

export async function updateAdminMeetingSettings(payload: MeetingSettingsPayload) {
  const formData = new FormData();
  formData.append('duration_minutes', String(payload.duration_minutes));
  formData.append('buffer_after_minutes', String(payload.buffer_after_minutes));
  formData.append('min_notice_hours', String(payload.min_notice_hours));
  formData.append('booking_window_days', String(payload.booking_window_days));
  formData.append('daily_meeting_limit', String(payload.daily_meeting_limit));

  const response = await apiService.post<[] | Record<string, unknown>>(
    'admin/settings/update-settings',
    formData,
    { skipGlobalToast: true }
  );

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response;
}
