import type React from 'react';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/auth-service';
import { useTranslation } from '@/lib/i18nContext';
import {
  deleteAllNotifications,
  deleteNotification,
  fetchNotifications,
  fetchUnreadNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  notificationKeys,
} from '../api/notifications-api';
import { mapApiNotification, type Notification } from '../types/notification.types';

export type NotificationFilterType = 'all' | 'unread' | 'system';

function getUserToken() {
  return authService.getUserToken();
}

export function useNotificationBadgeCount() {
  const { language } = useTranslation();

  const query = useQuery({
    queryKey: notificationKeys.unread(language),
    queryFn: () => fetchUnreadNotifications(language),
    enabled: typeof window !== 'undefined' && Boolean(getUserToken()),
    staleTime: 30_000,
    refetchInterval: 60_000,
    meta: { skipGlobalErrorToast: true },
  });

  return {
    unreadCount: query.data?.length ?? 0,
    isLoadingUnreadCount: query.isLoading,
    refetchUnreadCount: query.refetch,
  };
}

export function useNotifications() {
  const { t, dir, language } = useTranslation();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<NotificationFilterType>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const notificationsQuery = useQuery({
    queryKey: notificationKeys.list({ language }),
    queryFn: () => fetchNotifications({ language }),
    enabled: typeof window !== 'undefined' && Boolean(getUserToken()),
    meta: { skipGlobalErrorToast: true },
  });

  const notifications = useMemo(
    () => (notificationsQuery.data?.data ?? []).map(mapApiNotification),
    [notificationsQuery.data?.data],
  );

  const invalidateNotifications = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread(language) }),
    ]);
  };

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id, language),
    onSuccess: invalidateNotifications,
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(language),
    onSuccess: invalidateNotifications,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNotification(id, language),
    onSuccess: async (_data, id) => {
      if (selectedNotification?.id === id) setSelectedNotification(null);
      await invalidateNotifications();
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: () => deleteAllNotifications(language),
    onSuccess: async () => {
      setSelectedNotification(null);
      await invalidateNotifications();
    },
  });

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'system') return n.type === 'system' || n.type === 'warning';
    return true;
  });

  const handleOpen = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markReadMutation.mutate(notification.id);
    }
  };

  const handleDismiss = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    deleteMutation.mutate(id);
  };

  const handleMarkAllRead = () => {
    if (notifications.some((notification) => !notification.read)) {
      markAllReadMutation.mutate();
    }
  };

  const handleDeleteAll = () => {
    const confirmed = window.confirm(t('notif.confirm_delete_all'));
    if (!confirmed) return;

    if (notifications.length > 0) {
      deleteAllMutation.mutate();
    }
  };

  return {
    t,
    dir,
    notifications,
    filteredNotifications,
    activeFilter,
    setActiveFilter,
    selectedNotification,
    setSelectedNotification,
    handleOpen,
    handleDismiss,
    handleMarkAllRead,
    handleDeleteAll,
    isLoading: notificationsQuery.isLoading,
    isFetching: notificationsQuery.isFetching,
    isError: notificationsQuery.isError,
    errorMessage: notificationsQuery.error instanceof Error ? notificationsQuery.error.message : null,
    refetch: notificationsQuery.refetch,
    unreadCount: notifications.filter((notification) => !notification.read).length,
    isMutating:
      markReadMutation.isPending ||
      markAllReadMutation.isPending ||
      deleteMutation.isPending ||
      deleteAllMutation.isPending,
  };
}
