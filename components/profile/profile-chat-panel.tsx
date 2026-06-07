'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18nContext';
import { useSupportChat, BOTTOM_SAFE_AREA } from '@/features/support/hooks/use-support-chat';
import ChatHeader from '@/features/support/components/chat-header';
import ChatMessageList from '@/features/support/components/chat-message-list';
import ChatInputBar from '@/features/support/components/chat-input-bar';

export default function ProfileChatPanel() {
  const { dir } = useTranslation();
  const {
    t,
    inputText,
    setInputText,
    pageRef,
    messagesEndRef,
    composerRef,
    handleSend,
    handleKeyDown,
    groupedMessages,
  } = useSupportChat({ embedded: true });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[var(--text)]">{t('chat.header')}</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          {dir === 'rtl' ? 'تواصل مع فريق الدعم مباشرة من حسابك.' : 'Message our support team directly from your account.'}
        </p>
      </div>

      <div
        ref={pageRef}
        className="flex min-h-[min(70dvh,40rem)] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]"
      >
        <ChatHeader />

        <ChatMessageList
          groupedMessages={groupedMessages}
          messagesEndRef={messagesEndRef}
          bottomSafeArea={BOTTOM_SAFE_AREA}
        />

        <ChatInputBar
          inputText={inputText}
          onChangeInput={setInputText}
          onKeyDown={handleKeyDown}
          onSend={handleSend}
          placeholder={t('chat.type_message')}
          dir={dir}
          composerRef={composerRef}
        />
      </div>
    </div>
  );
}
