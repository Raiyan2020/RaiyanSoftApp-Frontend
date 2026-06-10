"use client";

import { useEffect, useState } from 'react';

class AdminChatStore {
  private totalUnread = 0;
  private isSoundEnabled = false;
  private currentOpenChatId: string | null = null;
  private listeners: (() => void)[] = [];

  public setCurrentChat(chatId: string | null) {
    this.currentOpenChatId = chatId;
  }

  public async toggleSound(enabled: boolean) {
    this.isSoundEnabled = enabled;
    if (enabled && typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    this.notify();
  }

  public getSoundStatus() {
    return this.isSoundEnabled;
  }

  public getUnreadCount() {
    return this.totalUnread;
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((current) => current !== listener);
    };
  }
}

export const adminChatStore = new AdminChatStore();

export const useAdminChatNotifications = () => {
  const [totalUnread, setTotalUnread] = useState(adminChatStore.getUnreadCount());
  const [isSoundEnabled, setIsSoundEnabled] = useState(adminChatStore.getSoundStatus());

  useEffect(() => {
    const update = () => {
      setTotalUnread(adminChatStore.getUnreadCount());
      setIsSoundEnabled(adminChatStore.getSoundStatus());
    };

    update();
    return adminChatStore.subscribe(update);
  }, []);

  return { totalUnread, isSoundEnabled };
};
