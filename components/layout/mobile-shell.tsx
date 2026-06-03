'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18nContext';
import DesktopHeader from './desktop-header';

interface MobileShellProps {
  children: ReactNode;
}

export default function MobileShell({ children }: MobileShellProps) {
  const { dir } = useTranslation();
  const pathname = usePathname();
  const isLeadPage = pathname === '/lead';

  return (
    <div className="app-shell" dir={dir}>
      <div className="noise-bg fixed inset-0 pointer-events-none opacity-[0.025] z-0" />
      <div className="app-content">
        {!isLeadPage ? <DesktopHeader /> : null}
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
}
