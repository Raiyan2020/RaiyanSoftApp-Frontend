'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18nContext';
import PublicNavbar from '@/components/public/public-navbar';
import AppSidebar from './app-sidebar';

interface MobileShellProps {
  children: ReactNode;
  /** Reserve space for the fixed phone tab bar only on routes that show it. */
  withBottomNav?: boolean;
}

export default function MobileShell({ children, withBottomNav = false }: MobileShellProps) {
  const { dir } = useTranslation();
  const pathname = usePathname();
  const isLeadPage = pathname === '/lead';

  return (
    <div className="app-shell" dir={dir}>
      <div className="noise-bg fixed inset-0 pointer-events-none opacity-[0.025] z-0" />
      {/* Same fixed site navbar as the public pages; pt-20/md:pt-24 clears it. */}
      {!isLeadPage ? <PublicNavbar /> : null}
      <div className={`app-content${isLeadPage ? '' : ' pt-20 md:pt-24'}`}>
        <div className="mx-auto flex w-full max-w-7xl flex-1 md:px-6 lg:px-8">
          {!isLeadPage ? <AppSidebar /> : null}
          <main className={`app-main min-w-0${withBottomNav ? ' app-main-tabbed' : ''}`}>{children}</main>
        </div>
      </div>
    </div>
  );
}
