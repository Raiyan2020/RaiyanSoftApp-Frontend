'use client';

import MobileShell from '@/components/layout/mobile-shell';
import BottomNav from '@/components/layout/bottom-nav';
import ErrorBoundary from '@/components/layout/error-boundary';
import { usePathname } from 'next/navigation';

export default function MobileLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const standalonePages = ['/book', '/login', '/signup'];
  const isStandalone = standalonePages.includes(pathname || '');
  const mainTabs = ['/home', '/support', '/appointments', '/notifications', '/more'];
  const showBottomNav = mainTabs.includes(pathname || '');

  if (isStandalone) {
    return <ErrorBoundary>{children}</ErrorBoundary>;
  }

  return (
    <MobileShell>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      {showBottomNav ? <BottomNav /> : null}
    </MobileShell>
  );
}
