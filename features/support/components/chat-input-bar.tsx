import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface ChatInputBarProps {
  inputText: string;
  onChangeInput: (val: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  placeholder: string;
  dir: string;
  composerRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatInputBar({
  inputText,
  onChangeInput,
  onKeyDown,
  onSend,
  placeholder,
  dir,
  composerRef,
}: ChatInputBarProps) {
  return (
    <div ref={composerRef} className="shrink-0 z-40 px-4 sm:px-6 pb-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-[var(--surface)] backdrop-blur-xl p-2 rounded-2xl border border-[var(--border)] shadow-lg flex items-end gap-2"
      >
        <textarea
          value={inputText}
          onChange={(e) => onChangeInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={1}
          dir={dir}
          className="flex-1 bg-transparent text-[var(--text)] placeholder:text-[var(--text-muted)] text-sm py-3 focus:outline-none resize-none max-h-24 no-scrollbar"
          style={{ minHeight: '44px' }}
        />

        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={onSend}
          disabled={!inputText.trim()}
          className={`p-3 rounded-xl transition-all duration-300 shrink-0 ${
            inputText.trim() ? 'bg-primary text-white shadow-[0_0_15px_rgba(29,183,240,0.4)]' : 'bg-[var(--surface-2)] text-[var(--text-muted)]'
          }`}
        >
          {dir === 'rtl' ? <Send size={20} className="scale-x-[-1]" /> : <Send size={20} />}
        </motion.button>
      </motion.div>
    </div>
  );
}
