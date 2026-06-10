'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthGuard } from '@/lib/authGuardContext';
import { authService } from '@/lib/auth-service';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { requireAuth } = useAuthGuard();
  const router = useRouter();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;

    if (!authService.getUser()) {
      hasChecked.current = true;
      requireAuth(() => {});
      router.replace('/home');
    }
  }, [requireAuth, router]);

  if (authService.getUser()) {
    return <>{children}</>;
  }

  return null;
}
