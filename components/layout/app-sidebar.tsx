'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, MessageCircle, Calendar, Bell, MoreHorizontal } from 'lucide-react';
import { useNotificationBadgeCount } from '@/features/notifications/hooks/use-notifications';
import { useUserMetadata } from '@/lib/userMetadataStore';
import { useTranslation } from '@/lib/i18nContext';
import { useAuthGuard } from '@/lib/authGuardContext';

// Client-app section nav. Phones keep the bottom tab bar, so this is md+ only;
// between md and lg it collapses to icons to leave room for the page.
export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { unreadCount } = useNotificationBadgeCount();
  const { chatUnreadCount } = useUserMetadata();
  const { t } = useTranslation();
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
    <aside className="hidden md:block w-16 lg:w-60 shrink-0 self-start sticky top-24 pt-6 lg:pt-8">
      <nav
        aria-label={t('app.nav_label')}
        className="flex flex-col gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-sm"
      >
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
              className={`group relative flex min-h-10 w-full items-center justify-center lg:justify-start gap-2.5 rounded-lg px-2 lg:px-3 py-2 text-start transition-colors duration-150 ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
              }`}
            >
              {isActive ? (
                <span aria-hidden="true" className="absolute inset-y-1.5 start-0 hidden w-0.5 rounded-full bg-primary lg:block" />
              ) : null}
              <span className="relative flex shrink-0 items-center">
                <tab.icon size={18} className={isActive ? 'text-primary' : ''} />
                {tab.badge > 0 ? (
                  <span className="absolute -top-2 -end-2 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[11px] font-bold leading-none text-white ring-2 ring-[var(--surface)]">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                ) : null}
              </span>
              <span className={`hidden min-w-0 flex-1 truncate text-sm lg:inline ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
