"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toast = {
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    info: (msg: string) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed top-4 end-4 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full p-4">
        <AnimatePresence>
          {toasts.map((t) => {
            let icon = <Info className="text-blue-400" size={20} />;
            let borderColor = 'border-blue-500/20';
            let bgColor = 'bg-slate-900/90';

            if (t.type === 'success') {
              icon = <CheckCircle className="text-emerald-400" size={20} />;
              borderColor = 'border-emerald-500/20';
            } else if (t.type === 'error') {
              icon = <AlertCircle className="text-red-400" size={20} />;
              borderColor = 'border-red-500/20';
            }

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className={`flex items-start gap-3 p-4 rounded-2xl border ${borderColor} ${bgColor} backdrop-blur-xl shadow-2xl pointer-events-auto relative overflow-hidden`}
              >
                <div className="shrink-0 mt-0.5">{icon}</div>
                <div className="flex-1 text-sm text-slate-100 font-medium pe-6">
                  {t.message}
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="absolute top-3 end-3 text-slate-500 hover:text-slate-300 transition-colors p-1"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Global Toast helper to trigger toasts outside of standard React context
let globalToastInstance: ToastContextType['toast'] | null = null;

export const setGlobalToast = (toastInstance: ToastContextType['toast']) => {
  globalToastInstance = toastInstance;
};

export const globalToast = {
  success: (msg: string) => globalToastInstance?.success(msg),
  error: (msg: string) => globalToastInstance?.error(msg),
  info: (msg: string) => globalToastInstance?.info(msg),
};

export const ToastInitializer: React.FC = () => {
  const { toast } = useToast();
  React.useEffect(() => {
    setGlobalToast(toast);
  }, [toast]);
  return null;
};

