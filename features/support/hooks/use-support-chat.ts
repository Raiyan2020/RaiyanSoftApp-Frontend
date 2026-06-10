import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { chatStore, useMessages as useStoreMessages, Message } from '@/lib/chatStore';
import { useTranslation } from '@/lib/i18nContext';
import { globalToast } from '@/lib/toast-context';

export const TAB_BAR_HEIGHT = 80;
export const BOTTOM_SAFE_AREA = 20;

export function useSupportChat(options?: { embedded?: boolean }) {
  const { messages } = useStoreMessages();
  const [inputText, setInputText] = useState('');
  const { t, dir } = useTranslation();
  const tabBarHeight = options?.embedded ? 0 : TAB_BAR_HEIGHT;

  const pageRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!composerRef.current || !pageRef.current) return;

    const updateHeights = () => {
      const composerH = composerRef.current?.offsetHeight || 60;
      pageRef.current?.style.setProperty('--composer-h', `${composerH}px`);
      pageRef.current?.style.setProperty('--tabbar-h', `${tabBarHeight}px`);
    };

    updateHeights();

    const observer = new ResizeObserver(updateHeights);
    observer.observe(composerRef.current);

    return () => observer.disconnect();
  }, [tabBarHeight]);

  const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  };

  useEffect(() => {
    const timer = setTimeout(() => scrollToBottom('auto'), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    try {
      await chatStore.sendMessage(inputText.trim());
      setInputText('');
      setTimeout(() => scrollToBottom('auto'), 50);
    } catch (err: any) {
      globalToast.info(err?.message || 'Support chat is not available yet.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const groupedMessages: { date: number; msgs: Message[] }[] = [];
  messages.forEach((msg) => {
    const d = new Date(msg.createdAt);
    if (isNaN(d.getTime())) return;

    const date = d.setHours(0, 0, 0, 0);
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    if (lastGroup && lastGroup.date === date) {
      lastGroup.msgs.push(msg);
    } else {
      groupedMessages.push({ date, msgs: [msg] });
    }
  });

  return {
    t,
    dir,
    inputText,
    setInputText,
    pageRef,
    messagesEndRef,
    composerRef,
    handleSend,
    handleKeyDown,
    groupedMessages,
  };
}
