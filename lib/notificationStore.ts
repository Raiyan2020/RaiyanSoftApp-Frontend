"use client";

import { useEffect, useState } from 'react';

export type NotificationType = 'system' | 'success' | 'warning' | 'message' | 'payment';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  dismissed: boolean;
  userId?: string;
}

class NotificationStore {
  private notifications: Notification[] = [];
  private listeners: (() => void)[] = [];

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((current) => current !== listener);
    };
  }

  getNotifications() {
    return this.notifications;
  }

  getUnreadCount() {
    return this.notifications.filter((notification) => !notification.read).length;
  }

  async markAsRead(_id: string) {
    this.notify();
  }

  async markAllAsRead() {
    this.notifications = this.notifications.map((notification) => ({ ...notification, read: true }));
    this.notify();
  }

  async dismiss(id: string) {
    this.notifications = this.notifications.filter((notification) => notification.id !== id);
    this.notify();
  }
}

export const notificationStore = new NotificationStore();

export const useNotifications = () => {
  const [data, setData] = useState({
    notifications: notificationStore.getNotifications(),
    unreadCount: notificationStore.getUnreadCount(),
  });

  useEffect(() => {
    const update = () => {
      setData({
        notifications: notificationStore.getNotifications(),
        unreadCount: notificationStore.getUnreadCount(),
      });
    };

    update();
    return notificationStore.subscribe(update);
  }, []);

  return data;
};
