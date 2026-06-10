import type { ApiNotification } from '../services/notifications-api';

export type NotificationType = 'system' | 'success' | 'warning' | 'message' | 'payment';

export interface Notification {
  id: string;
  type: NotificationType;
  rawType: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  createdAt: string;
  createdAtDiff?: string;
  data: ApiNotification['data'];
}

export function mapApiNotification(notification: ApiNotification): Notification {
  const rawType = notification.data?.type || notification.type || 'system';

  return {
    id: notification.id,
    type: mapNotificationType(String(rawType)),
    rawType: String(rawType),
    title: notification.data?.title || 'Notification',
    message: notification.data?.message || '',
    timestamp: notification.created_at ? new Date(notification.created_at).getTime() : Date.now(),
    read: Boolean(notification.read_at),
    createdAt: notification.created_at,
    createdAtDiff: notification.created_at_diff,
    data: notification.data ?? {},
  };
}

function mapNotificationType(type: string): NotificationType {
  const normalized = type.toLowerCase();

  if (normalized.includes('approved') || normalized.includes('success')) return 'success';
  if (normalized.includes('reject') || normalized.includes('warning') || normalized.includes('cancel')) return 'warning';
  if (normalized.includes('message') || normalized.includes('chat') || normalized.includes('meeting')) return 'message';
  if (normalized.includes('payment') || normalized.includes('invoice')) return 'payment';

  return 'system';
}
