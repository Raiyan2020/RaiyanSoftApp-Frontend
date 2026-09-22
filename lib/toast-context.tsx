"use client";

import React, { createContext, useContext, type ReactNode } from 'react';
import { Toaster, toast as sonnerToast } from 'sonner';
import { translateMessage } from './i18n-utils';
import { useTheme } from './themeContext';

type ToastFn = (message: string) => void;
const ACTION_TOAST_ID = 'global-action-toast';

function showActionToast(type: 'success' | 'error' | 'info', message: string) {
  sonnerToast[type](translateMessage(message), { id: ACTION_TOAST_ID });
}

interface ToastContextType {
  toast: {
    success: ToastFn;
    error: ToastFn;
    info: ToastFn;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastApi: ToastContextType['toast'] = {
  success: (message) => showActionToast('success', message),
  error: (message) => showActionToast('error', message),
  info: (message) => showActionToast('info', message),
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  return (
    <ToastContext.Provider value={{ toast: toastApi }}>
      {children}
      {/* Sonner defaulted to its light palette regardless of the app theme, so
          toasts rendered as a light card over a dark UI, and richColors' error
          text measured 4.35:1. Both now follow the app's own tokens. */}
      <Toaster
        theme={theme}
        closeButton
        position="top-right"
        visibleToasts={1}
        toastOptions={{
          classNames: {
            toast:
              'font-sans !bg-[var(--surface)] !text-[var(--text)] !border-[var(--border)] !shadow-[var(--shadow-soft)]',
            description: '!text-[var(--text-muted)]',
            error: '!text-danger !border-[color-mix(in_srgb,var(--danger)_38%,transparent)]',
            success: '!text-success !border-[color-mix(in_srgb,var(--success)_38%,transparent)]',
            info: '!text-info !border-[color-mix(in_srgb,var(--info)_38%,transparent)]',
            // Sonner hardcodes the close button at 20x20 in its own CSS, below
            // the 24px minimum target size; !h-6/!w-6 overrides it to 24x24.
            closeButton: '!h-6 !w-6 !bg-[var(--surface-2)] !text-[var(--text)] !border-[var(--border)]',
          },
        }}
      />
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

export const setGlobalToast = (_toastInstance: ToastContextType['toast']) => {
  // Kept for compatibility with existing provider setup.
};

export const globalToast = toastApi;

export const ToastInitializer: React.FC = () => null;
