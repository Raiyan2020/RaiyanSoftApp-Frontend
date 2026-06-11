"use client";

import { useEffect } from 'react';
import { globalToast } from '@/lib/toast-context';

interface ErrorAlertProps {
  message?: string | null;
  className?: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  useEffect(() => {
    if (!message) return;
    globalToast.error(message);
  }, [message]);

  return null;
}
