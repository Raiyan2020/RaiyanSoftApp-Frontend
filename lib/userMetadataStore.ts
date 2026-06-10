"use client";

import { useEffect, useState } from 'react';

interface UserMetadata {
  chatUnreadCount: number;
}

class UserMetadataStore {
  private metadata: UserMetadata = { chatUnreadCount: 0 };
  private listeners: (() => void)[] = [];

  getMetadata() {
    return this.metadata;
  }

  subscribeListener(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((current) => current !== listener);
    };
  }
}

export const userMetadataStore = new UserMetadataStore();

export const useUserMetadata = () => {
  const [metadata, setMetadata] = useState(userMetadataStore.getMetadata());

  useEffect(() => {
    const unsubscribe = userMetadataStore.subscribeListener(() => {
      setMetadata(userMetadataStore.getMetadata());
    });
    return unsubscribe;
  }, []);

  return metadata;
};
