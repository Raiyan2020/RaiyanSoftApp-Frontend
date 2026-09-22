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
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            role="alertdialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl"
          >
            <h2 className="text-xl font-bold text-[var(--text)] mb-2">{translateMessage(title)}</h2>
            <p className="text-[var(--text-muted)] text-sm mb-6 leading-relaxed">{translateMessage(message)}</p>

            {/* gap instead of space-x (which is margin-left only and inverts
                under RTL), and the confirm button no longer stretches to the
                same width as cancel - the two actions are not equivalent. */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                disabled={confirming}
                className="min-h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-5 text-sm font-bold text-[var(--text)] transition-colors hover:bg-[var(--surface-3)] disabled:opacity-60"
              >
                {translateMessage(cancelText)}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={confirming}
                className={`min-h-11 rounded-xl border px-5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                  isDestructive
                    ? // A hardcoded white label measured 2.77:1 on the dark theme's
                      // --danger (#f87171). This stays a solid fill — it is the
                      // modal's primary action — and takes its label from
                      // --on-danger, which inverts with the theme like --on-primary.
                      'border-transparent bg-danger text-on-danger hover:opacity-90'
                    : 'border-transparent bg-primary text-on-primary hover:bg-primary-dark'
                }`}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {confirming ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : null}
                  {/* The pending label used to read "Deleting..." for every
                      confirm, including non-destructive ones. */}
                  {confirming
                    ? translateMessage(isDestructive ? 'Deleting...' : 'Saving...')
                    : translateMessage(confirmText)}
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
