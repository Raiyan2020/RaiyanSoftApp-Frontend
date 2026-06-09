'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth-service';

export default function AdminLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = authService.subscribe(({ admin }) => {
      if (admin) {
        router.replace('/admin/projects');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return null;
}
