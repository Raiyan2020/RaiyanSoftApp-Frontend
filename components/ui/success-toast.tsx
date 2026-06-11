'use client';

import { useEffect } from 'react';
import { globalToast } from '@/lib/toast-context';

interface SuccessToastProps {
  message?: string | null;
}

export default function SuccessToast({ message }: SuccessToastProps) {
  useEffect(() => {
    if (!message) return;
    globalToast.success(message);
  }, [message]);

  return null;
}
