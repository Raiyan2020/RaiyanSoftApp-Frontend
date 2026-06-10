import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { translateMessage } from '@/lib/i18n-utils';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-2xl overflow-hidden relative"
          >
            <div
              className={`absolute top-0 start-0 w-full h-1 ${
                isDestructive ? 'bg-red-500' : 'bg-primary'
              } opacity-80`}
            />

            <h3 className="text-xl font-bold text-[var(--text)] mb-2">{translateMessage(title)}</h3>
            <p className="text-[var(--text-muted)] text-sm mb-6 leading-relaxed">{translateMessage(message)}</p>

            <div className="flex space-x-3 rtl:space-x-reverse">
              <button
                onClick={onCancel}
                className="flex-1 py-3 rounded-xl bg-[var(--surface-2)] text-[var(--text)] font-medium text-sm hover:opacity-90 transition-colors border border-[var(--border)]"
              >
                {translateMessage(cancelText)}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-3 rounded-xl text-[var(--text)] font-medium text-sm transition-all shadow-lg ${
                  isDestructive
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                    : 'bg-primary hover:bg-sky-500 shadow-primary/20'
                }`}
              >
                {translateMessage(confirmText)}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
