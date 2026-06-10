"use client";

import React, { createContext, useContext, type ReactNode } from 'react';
import { Toaster, toast as sonnerToast } from 'sonner';
import { translateMessage } from './i18n-utils';

type ToastFn = (message: string) => void;

interface ToastContextType {
  toast: {
    success: ToastFn;
    error: ToastFn;
    info: ToastFn;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastApi: ToastContextType['toast'] = {
  success: (message) => sonnerToast.success(translateMessage(message)),
  error: (message) => sonnerToast.error(translateMessage(message), { id: `global-error-${message}` }),
  info: (message) => sonnerToast.info(translateMessage(message)),
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ToastContext.Provider value={{ toast: toastApi }}>
      {children}
      <Toaster
        richColors
        closeButton
        position="top-right"
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
