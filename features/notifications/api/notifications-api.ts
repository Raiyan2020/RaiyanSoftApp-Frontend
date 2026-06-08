import { apiService, type ApiResponse } from '@/lib/api-service';

export type ApiNotificationType =
  | 'ad_approved'
  | 'ad_rejected'
  | 'meeting_booked'
  | 'meeting_approved'
  | 'meeting_rejected'
  | 'project_updated'
  | 'system'
  | string;

export interface ApiNotificationPayload {
  title?: string;
  message?: string;
  type?: string;
  ad_id?: number;
  project_id?: number | string;
  meeting_id?: number | string;
  [key: string]: unknown;
}

export interface ApiNotification {
  id: string;
  type: ApiNotificationType;
  data: ApiNotificationPayload;
  read_at: string | null;
  created_at: string;
  created_at_diff?: string;
}

export interface NotificationPagination {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export interface NotificationsListResponse {
  data: ApiNotification[];
  pagination: NotificationPagination | null;
}

export interface NotificationQueryParams {
  page?: number;
  perPage?: number;
  language?: 'ar' | 'en';
}

const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params?: NotificationQueryParams) => [...notificationKeys.lists(), params ?? {}] as const,
  unread: (language?: 'ar' | 'en') => [...notificationKeys.all, 'unread', language ?? 'ar'] as const,
};

function assertNotificationResponse<T>(response: ApiResponse<T>) {
  if (!response.status) {
    throw new Error(response.message || 'Notification request failed.');
  }

  return response;
}

function getLanguageHeaders(language: 'ar' | 'en' = 'ar') {
  return {
    'Accept-Language': language,
  };
}

function toQueryString(params?: NotificationQueryParams) {
  const search = new URLSearchParams();
  if (params?.page) search.set('page', String(params.page));
  if (params?.perPage) search.set('per_page', String(params.perPage));
  const value = search.toString();
  return value ? `?${value}` : '';
}

export async function fetchNotifications(params?: NotificationQueryParams): Promise<NotificationsListResponse> {
  const response = await apiService.get<ApiNotification[]>(`notifications${toQueryString(params)}`, {
    headers: getLanguageHeaders(params?.language),
  });
  const data = assertNotificationResponse(response);

  return {
    data: data.data ?? [],
    pagination: (data as ApiResponse<ApiNotification[]> & { pagination?: NotificationPagination }).pagination ?? null,
  };
}

export async function fetchUnreadNotifications(language: 'ar' | 'en' = 'ar'): Promise<ApiNotification[]> {
  const response = await apiService.get<ApiNotification[]>('notifications/unread', {
    headers: getLanguageHeaders(language),
  });

  return assertNotificationResponse(response).data ?? [];
}

export async function markNotificationRead(id: string, language: 'ar' | 'en' = 'ar') {
  const response = await apiService.post<ApiNotification | ApiNotification[]>(`notifications/${id}/read`, undefined, {
    headers: getLanguageHeaders(language),
  });

  return assertNotificationResponse(response).data;
}

export async function markAllNotificationsRead(language: 'ar' | 'en' = 'ar') {
  const response = await apiService.post<ApiNotification[]>('notifications/read-all', undefined, {
    headers: getLanguageHeaders(language),
  });

  return assertNotificationResponse(response).data ?? [];
}

export async function deleteNotification(id: string, language: 'ar' | 'en' = 'ar') {
  const response = await apiService.delete<[] | Record<string, unknown>>(`notifications/${id}`, {
    headers: getLanguageHeaders(language),
  });

  return assertNotificationResponse(response).data;
}

export async function deleteAllNotifications(language: 'ar' | 'en' = 'ar') {
  const response = await apiService.delete<[] | Record<string, unknown>>('notifications/', {
    headers: getLanguageHeaders(language),
  });

  return assertNotificationResponse(response).data;
}

export { notificationKeys };
