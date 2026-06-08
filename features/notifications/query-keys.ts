import type { NotificationQueryParams } from './api/notifications-api';

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params?: NotificationQueryParams) => [...notificationKeys.lists(), params ?? {}] as const,
  unread: (language?: 'ar' | 'en') => [...notificationKeys.all, 'unread', language ?? 'ar'] as const,
};
