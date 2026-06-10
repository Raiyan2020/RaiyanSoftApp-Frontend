"use client";

import { useEffect } from 'react';
import { toast } from 'sonner';
import { translateMessage } from '@/lib/i18n-utils';

interface ErrorAlertProps {
  message?: string | null;
  className?: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  useEffect(() => {
    if (!message) return;
    toast.error(translateMessage(message), { id: `error-alert-${message}` });
  }, [message]);

  return null;
}
