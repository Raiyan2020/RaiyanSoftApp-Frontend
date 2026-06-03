import React from 'react';
import { useSupportChat, BOTTOM_SAFE_AREA } from '../hooks/use-support-chat';
import ChatHeader from './chat-header';
import ChatMessageList from './chat-message-list';
import ChatInputBar from './chat-input-bar';

export default function SupportChatPage() {
  const {
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
  } = useSupportChat();

  return (
    <div
      ref={pageRef}
      className="app-page app-page-wide flex min-h-[calc(100dvh-5.5rem)] lg:min-h-[calc(100dvh-4.5rem)] flex-col"
    >
      <div className="app-card flex min-h-[calc(100dvh-7.5rem)] lg:min-h-[calc(100dvh-8.5rem)] flex-col overflow-hidden rounded-2xl">
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
