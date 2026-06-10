"use client";

import React, { createContext, useContext, useMemo, useState } from 'react';
import Button from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
};

type ConfirmState = {
  open: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  destructive: boolean;
  resolve: ((value: boolean) => void) | null;
};

type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

let globalConfirmFn: ConfirmContextType['confirm'] | null = null;

export function setGlobalConfirm(fn: ConfirmContextType['confirm']) {
  globalConfirmFn = fn;
}

export const globalConfirm = {
  confirm: (options: ConfirmOptions) => globalConfirmFn?.(options) ?? Promise.resolve(false),
};

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfirmState>({
    open: false,
    title: 'Please confirm',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    destructive: false,
    resolve: null,
  });

  const confirm = useMemo(
    () =>
      (options: ConfirmOptions) =>
        new Promise<boolean>((resolve) => {
          setState({
            open: true,
            title: options.title || 'Please confirm',
            message: options.message,
            confirmText: options.confirmText || 'Confirm',
            cancelText: options.cancelText || 'Cancel',
            destructive: Boolean(options.destructive),
            resolve,
          });
        }),
    []
  );

  React.useEffect(() => {
    setGlobalConfirm(confirm);
  }, [confirm]);

  const close = (value: boolean) => {
    state.resolve?.(value);
    setState((prev) => ({ ...prev, open: false, resolve: null }));
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Dialog open={state.open} onOpenChange={(open) => !open && close(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{state.title}</DialogTitle>
            <DialogDescription>{state.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={() => close(false)}>
              {state.cancelText}
            </Button>
            <Button
              variant={state.destructive ? 'destructive' : 'primary'}
              type="button"
              onClick={() => close(true)}
            >
              {state.confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return context;
}
