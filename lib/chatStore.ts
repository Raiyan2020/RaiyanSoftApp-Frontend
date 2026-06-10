"use client";

import { useEffect, useState } from 'react';

export interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'staff';
  createdAt: number;
  senderName?: string;
}

class ChatStore {
  private messages: Message[] = [];
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

  getMessages() {
    return [...this.messages];
  }

  async sendMessage(_text: string) {
    throw new Error('Support chat is not available in the Laravel backend routes yet.');
  }

  reset() {
    this.messages = [];
    this.notify();
  }
}

export const chatStore = new ChatStore();

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>(chatStore.getMessages());

  useEffect(() => {
    const update = () => setMessages(chatStore.getMessages());
    update();
    return chatStore.subscribe(update);
  }, []);

  return { messages };
};
