"use client";

import React, { createContext, useContext, type ReactNode } from 'react';
import { Toaster, toast as sonnerToast } from 'sonner';
import { translateMessage } from './i18n-utils';

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
  return (
    <ToastContext.Provider value={{ toast: toastApi }}>
      {children}
      <Toaster
        richColors
        closeButton
        position="top-right"
        visibleToasts={1}
        toastOptions={{
          classNames: {
            toast: 'font-sans',
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
