import React from 'react';
import { MessageCircle, CheckCircle } from 'lucide-react';
import Avatar from '@/components/ui/avatar';
import { Message, Conversation } from '../hooks/use-admin-live-chat';
import AdminChatMessage from './admin-chat-message';
import AdminChatInput from './admin-chat-input';

interface ChatPanelProps {
  selectedId: string | null;
  selectedConversation?: Conversation;
  messages: Message[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onCloseConversation: () => void;
  inputText: string;
  setInputText: (val: string) => void;
  onSend: (e?: React.FormEvent) => void;
}

export default function ChatPanel({
  selectedId,
  selectedConversation,
  messages,
  scrollRef,
  onCloseConversation,
  inputText,
  setInputText,
  onSend,
}: ChatPanelProps) {
  return (
    <div className="flex-1 flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xl relative">
      {selectedId ? (
        <>
          <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-2)] flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <Avatar name={selectedConversation?.customerName || 'User'} size="md" className="w-10 h-10" />
              <div>
                <h2 className="text-[var(--text)] font-bold text-base">
                  {selectedConversation?.customerName || 'Unknown User'}
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs text-emerald-400 font-medium">Open Ticket</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onCloseConversation}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-3)] hover:bg-[var(--surface-3)] text-[var(--text)] hover:text-[var(--text)] rounded-xl text-xs font-medium transition-colors border border-[var(--border)]"
            >
              <CheckCircle size={14} />
              Close Ticket
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--surface-2)]" ref={scrollRef}>
            {messages.map((msg, idx) => {
              const isStaff = msg.sender === 'staff';
              const showName = idx === 0 || messages[idx - 1].sender !== msg.sender;

              return (
                <AdminChatMessage
                  key={msg.id}
                  msg={msg}
                  isStaff={isStaff}
                  showName={showName}
                  customerName={selectedConversation?.customerName || 'Customer'}
                />
              );
            })}
          </div>

          <AdminChatInput inputText={inputText} setInputText={setInputText} onSend={onSend} />
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)]">
          <div className="w-20 h-20 bg-[var(--surface-3)] rounded-full flex items-center justify-center mb-4 border border-[var(--border)]">
            <MessageCircle size={32} className="opacity-50" />
          </div>
          <h3 className="text-[var(--text)] font-bold text-lg mb-2">Live Support Console</h3>
          <p className="max-w-xs text-center text-sm">
            Select an open conversation from the list to start chatting with a customer.
          </p>
        </div>
      )}
    </div>
  );
}
