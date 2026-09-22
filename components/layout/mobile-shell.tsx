'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18nContext';
import DesktopHeader from './desktop-header';

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
      <div className="app-content">
        {!isLeadPage ? <DesktopHeader /> : null}
        <main className={`app-main${withBottomNav ? ' app-main-tabbed' : ''}`}>{children}</main>
      </div>
    </div>
  );
}
