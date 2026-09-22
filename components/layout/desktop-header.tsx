'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, MessageCircle, Calendar, Bell, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotificationBadgeCount } from '@/features/notifications/hooks/use-notifications';
import { useUserMetadata } from '@/lib/userMetadataStore';
import { useTranslation } from '@/lib/i18nContext';
import { useAuthGuard } from '@/lib/authGuardContext';
import SafeImage from '../ui/safe-image';

export default function DesktopHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { unreadCount } = useNotificationBadgeCount();
  const { chatUnreadCount } = useUserMetadata();
  const { t, language, setLanguage } = useTranslation();
  const { requireAuth } = useAuthGuard();

  const tabs = [
    { id: 'home', icon: Home, label: t('home.my_apps'), path: '/home', protected: false, badge: 0 },
    { id: 'support', icon: MessageCircle, label: t('status.support'), path: '/support', protected: true, badge: chatUnreadCount },
    { id: 'appointments', icon: Calendar, label: t('appt.title'), path: '/appointments', protected: true, badge: 0 },
    { id: 'notifications', icon: Bell, label: t('notif.title'), path: '/notifications', protected: true, badge: unreadCount },
    { id: 'more', icon: MoreHorizontal, label: t('more.title'), path: '/more', protected: false, badge: 0 },
  ];

  const handleNav = (path: string, isProtected: boolean) => {
    if (isProtected) {
      requireAuth(() => router.push(path));
    } else {
      router.push(path);
    }
  };

  return (
    // Shown from md up. Below lg the tab labels collapse to icons so the five
    // tabs, brand and language switch still fit a 768px tablet without wrapping.
    <div className="hidden md:flex items-center justify-between gap-4 px-4 lg:px-8 py-3 bg-[var(--surface)] backdrop-blur-md border-b border-[var(--border)] sticky top-0 z-50 shrink-0">
      <button type="button" className="flex items-center gap-3" onClick={() => router.push('/home')}>
        <div className="w-9 h-9 relative">
          <SafeImage
            src="https://raiyansoft.com/wp-content/uploads/2024/05/cropped-App-Icon-1.png"
            alt="Raiyansoft"
            className="w-full h-full object-contain drop-shadow-[0_0_8px_rgb(var(--primary-glow-rgb) / 0.5)]"
          />
        </div>
        {/* i18n-ignore-next-line: brand name, never translated */}
        <span className="text-lg font-bold text-[var(--text)] tracking-tight">Raiyansoft</span>
      </button>

      <nav className="flex items-center gap-1 bg-[var(--surface-2)] p-1 rounded-xl border border-[var(--border)]">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.path) && (tab.path !== '/home' || pathname === '/home');
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleNav(tab.path, tab.protected)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              title={tab.label}
              className={`relative flex min-h-10 items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 group ${
                isActive ? 'text-primary' : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]'
              }`}
            >
              <div className="relative flex items-center">
                <tab.icon
                  size={18}
                  className={`transition-colors ${
                    isActive ? 'text-primary' : 'text-[var(--text-muted)] group-hover:text-[var(--text)]'
                  }`}
                />
                {tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -end-1.5 bg-red-500 text-white text-[11px] font-bold px-1 min-w-[14px] h-[14px] flex items-center justify-center rounded-full border-2 border-[var(--surface)] shadow-sm">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="hidden text-sm font-medium lg:inline">{tab.label}</span>

              {isActive ? (
                <motion.div
                  layoutId="desktopNavHighlight"
                  className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20 pointer-events-none"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="flex bg-[var(--surface-2)] backdrop-blur-md rounded-full p-1 border border-[var(--border)] shadow-sm shrink-0">
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`min-h-9 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
            language === 'en' ? 'bg-primary text-on-primary shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLanguage('ar')}
          className={`min-h-9 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
            language === 'ar' ? 'bg-primary text-on-primary shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          العربية
        </button>
      </div>
    </div>
  );
}
