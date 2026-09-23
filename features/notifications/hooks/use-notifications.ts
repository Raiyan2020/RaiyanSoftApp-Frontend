import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/auth-service';
import { globalConfirm } from '@/lib/confirm-dialog';
import { useTranslation } from '@/lib/i18nContext';
import { translateMessage } from '@/lib/i18n-utils';
import {
  deleteAllNotifications,
  deleteNotification,
  fetchNotifications,
  fetchUnreadNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notifications-api';
import { notificationKeys } from '../query-keys';
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
    // ponytail: /notifications/unread is paginated (10/page), so this caps at 10.
    unreadCount: query.data?.length ?? 0,
    unreadNotifications: query.data ?? [],
    isUnreadError: query.isError,
    isLoadingUnreadCount: query.isLoading,
    refetchUnreadCount: query.refetch,
  };
}

export function useNotifications() {
  const { t, dir, language } = useTranslation();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<NotificationFilterType>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [page, setPage] = useState(1);

  const handleSetActiveFilter = (filter: NotificationFilterType) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const notificationsQuery = useQuery({
    queryKey: notificationKeys.list({ language, page }),
    queryFn: () => fetchNotifications({ language, page }),
    enabled: typeof window !== 'undefined' && Boolean(getUserToken()),
    meta: { skipGlobalErrorToast: true },
  });

  const pagination = notificationsQuery.data?.pagination ?? null;

  const notifications = useMemo(
    () => (notificationsQuery.data?.data ?? []).map((notification) => mapApiNotification(notification, language)),
    [notificationsQuery.data?.data, language],
  );

  // A delete emptied the current page (e.g. deleting the last item on page
  // 2): step back a page rather than showing a dead-end empty page.
  useEffect(() => {
    if (!notificationsQuery.isFetching && page > 1 && notifications.length === 0) {
      setPage(page - 1);
    }
  }, [notificationsQuery.isFetching, page, notifications.length]);

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

  const handleDeleteAll = async () => {
    const confirmed = await globalConfirm.confirm({
      title: t('notif.confirm_delete_all'),
      message: t('notif.confirm_delete_all'),
      confirmText: translateMessage('Delete', language),
      cancelText: translateMessage('Cancel', language),
      destructive: true,
    });
    if (!confirmed || notifications.length === 0) return;

    deleteAllMutation.mutate();
  };

  return {
    t,
    dir,
    notifications,
    filteredNotifications,
    activeFilter,
    setActiveFilter: handleSetActiveFilter,
    pagination,
    page,
    setPage,
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
