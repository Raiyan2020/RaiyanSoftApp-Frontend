import { useRef, useState } from 'react';
import { globalToast } from '@/lib/toast-context';
import { adminChatStore, useAdminChatNotifications } from '@/lib/adminChatStore';

export interface Conversation {
  id: string;
  customerName: string;
  lastMessageText: string;
  lastMessageAt: number;
  status: 'open' | 'closed';
  unreadForAdmin: number;
}

export interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'staff';
  createdAt: number;
  senderName?: string;
}

const CHAT_UNAVAILABLE_MESSAGE = 'Live chat is not available in the Laravel backend routes yet.';

export function useAdminLiveChat() {
  const [conversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { isSoundEnabled } = useAdminChatNotifications();
  const scrollRef = useRef<HTMLDivElement>(null);

  const showUnavailable = () => {
    globalToast.info(CHAT_UNAVAILABLE_MESSAGE);
  };

  const handleSelectConversation = async (id: string) => {
    setSelectedId(id);
    adminChatStore.setCurrentChat(id);
    showUnavailable();
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    showUnavailable();
  };

  const handleCloseConversation = async () => {
    if (!selectedId) return;
    showUnavailable();
  };

  const toggleSound = () => {
    adminChatStore.toggleSound(!isSoundEnabled);
  };

  const filteredConversations = conversations.filter((conversation) =>
    conversation.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId);

  return {
    conversations,
    selectedId,
    messages,
    inputText,
    setInputText,
    searchTerm,
    setSearchTerm,
    isSoundEnabled,
    scrollRef,
    filteredConversations,
    selectedConversation,
    handleSelectConversation,
    handleSend,
    handleCloseConversation,
    toggleSound,
    formatTime,
  };
}
