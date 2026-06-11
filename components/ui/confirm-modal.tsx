import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { translateMessage } from '@/lib/i18n-utils';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  isDestructive?: boolean;
  isConfirming?: boolean;
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
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [internalConfirming, setInternalConfirming] = useState(false);
  const confirming = isConfirming || internalConfirming;

  const handleConfirm = async () => {
    if (confirming) return;
    try {
      setInternalConfirming(true);
      await Promise.resolve(onConfirm());
    } finally {
      setInternalConfirming(false);
    }
  };

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
                type="button"
                onClick={onCancel}
                disabled={confirming}
                className="flex-1 py-3 rounded-xl bg-[var(--surface-2)] text-[var(--text)] font-medium text-sm hover:opacity-90 transition-colors border border-[var(--border)]"
              >
                {translateMessage(cancelText)}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={confirming}
                className={`flex-1 py-3 rounded-xl text-[var(--text)] font-medium text-sm transition-all shadow-lg ${
                  isDestructive
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                    : 'bg-primary hover:bg-sky-500 shadow-primary/20'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <span className="inline-flex items-center gap-2">
                  {confirming ? <Loader2 size={14} className="animate-spin" /> : null}
                  {translateMessage(confirming ? 'Deleting...' : confirmText)}
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
