'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth-service';

export default function AdminIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = authService.subscribe(({ admin }) => {
      router.replace(admin ? '/admin/projects' : '/admin/login');
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--bg)] text-sm font-semibold text-[var(--text-muted)]">
      Loading admin dashboard...
    </div>
  );
}
