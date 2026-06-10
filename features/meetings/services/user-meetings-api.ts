import { apiService, ApiResponse } from '@/lib/api-service';
import {
  BookMeetingPayload,
  MeetingAvailability,
  MeetingsPagination,
  UserMeeting,
  UserMeetingsFilters,
  UserMeetingsListResult,
} from '../types/meeting.types';

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

export async function fetchMeetingAvailability(date: string) {
  const response = await apiService.get<MeetingAvailability>(
    `user/meetings/availability?date=${encodeURIComponent(date)}`,
    { skipGlobalToast: true }
  );

  if (!response.status || !response.data) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function bookMeeting(payload: BookMeetingPayload) {
  const formData = new FormData();
  formData.append('date_time', payload.date_time);
  formData.append('subject', payload.subject);
  if (payload.notes) formData.append('notes', payload.notes);
  formData.append('type', String(payload.type));

  const response = await apiService.post<[] | Record<string, unknown>>(
    'user/meetings/book',
    formData,
    { skipGlobalToast: true }
  );

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response;
}

export async function fetchUserMeetings(filters: UserMeetingsFilters = {}): Promise<UserMeetingsListResult> {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));

  const query = params.toString();
  const path = `user/meetings${query ? `?${query}` : ''}`;

  const response = (await apiService.get<UserMeeting[]>(path, {
    skipGlobalToast: true,
  })) as ApiResponse<UserMeeting[]> & { pagination?: MeetingsPagination };

  if (!response.status || !Array.isArray(response.data)) {
    throw new Error(getApiErrorMessage(response));
  }

  return {
    meetings: response.data,
    pagination: response.pagination ?? null,
  };
}

export async function cancelUserMeeting(id: number | string) {
  const formData = new FormData();
  const response = await apiService.post<[] | Record<string, unknown>>(
    `user/meetings/${id}/cancel`,
    formData,
    { skipGlobalToast: true }
  );

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response;
}
