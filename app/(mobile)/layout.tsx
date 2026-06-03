'use client';
import MobileShell from '@/components/layout/mobile-shell';
import BottomNav from '@/components/layout/bottom-nav';
import ErrorBoundary from '@/components/layout/error-boundary';
import { usePathname } from 'next/navigation';

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mainTabs = ['/home', '/support', '/appointments', '/notifications', '/more'];
  const showBottomNav = mainTabs.includes(pathname || '');

  return (
    <MobileShell>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      {showBottomNav ? <BottomNav /> : null}
    </MobileShell>
  );
}
