'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/admin-layout';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth-service';

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.subscribe(({ admin }) => {
      if (!admin || !authService.getAdminToken()) {
        authService.clearAdminSession();
        router.replace('/admin/login');
        return;
      }
      setIsChecking(false);
    });

    return () => unsubscribe();
  }, [router]);


  if (isChecking) {
    return (
      <div className="h-screen w-full bg-[var(--bg)] flex items-center justify-center text-[var(--text)]">Loading...</div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
