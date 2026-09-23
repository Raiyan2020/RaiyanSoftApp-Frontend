import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronDown, 
  Eye,
  FileText, 
  Sun, 
  Moon, 
  LogIn, 
  Calendar,
  Bell,
  FolderKanban,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';
import { authService, User } from '@/lib/auth-service';
import { guestStore } from '@/lib/guestStore';
import { logoutUser } from '@/features/auth/services/user-auth-api';
import { sectionLinks, pageLinks, headerPageLinks } from './NavbarLinks';
import Avatar from '@/components/ui/avatar';
import { getUserDisplayName } from '@/lib/user-display';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotificationBadgeCount } from '@/features/notifications/hooks/use-notifications';
import { markNotificationRead } from '@/features/notifications/services/notifications-api';
import { mapApiNotification } from '@/features/notifications/types/notification.types';
import { notificationKeys } from '@/features/notifications/query-keys';

interface NavbarDesktopProps {
  dark: boolean;
  onToggleDark: () => void;
  user: User | null;
  activeHref: string;
  pagesOpen: boolean;
  setPagesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scrollTo: (href: string) => void;
  onOpenAuth: () => void;
  onOpenBooking: () => void;
  onOpenLead: () => void;
}

export default function NavbarDesktop({
  dark,
  onToggleDark,
  user,
  activeHref,
  pagesOpen,
  setPagesOpen,
  scrollTo,
  onOpenAuth,
  onOpenBooking,
  onOpenLead,
}: NavbarDesktopProps) {
  const { t, dir, language, setLanguage } = useTranslation();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDisplayName = getUserDisplayName(user, t('home.guest'));
  const profileLinks = [
    { href: '/profile', label: t('profile.title'), icon: UserIcon },
    { href: '/profile?tab=project', label: t('landing.nav.projects_tab'), icon: FolderKanban },
    { href: '/profile?tab=booking', label: t('landing.nav.meetings_tab'), icon: Calendar },
    { href: '/profile?tab=notification', label: t('notif.title'), icon: Bell },
  ] as const;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      if (authService.getUserToken()) {
        await logoutUser();
      }
    } catch (error) {
      console.error('Backend sign out failed', error);
    } finally {
      authService.clearUserSession();
      guestStore.setGuest(false);
      setDropdownOpen(false);
      router.push('/');
    }
  };

  const navLinkClass =
    'rounded-full px-3 py-2 text-sm font-bold text-slate-900 transition-colors duration-200 hover:bg-slate-900/[0.06] hover:text-primary-dark dark:text-slate-100 dark:hover:bg-white/10';
  const navLinkActiveClass = 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/25 dark:bg-primary/20 dark:ring-primary/15';
  const iconButtonClass =
    'grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-800 shadow-sm ring-1 ring-slate-200/80 transition-all duration-200 hover:bg-slate-50 hover:text-primary dark:bg-white/10 dark:text-slate-200 dark:shadow-none dark:ring-white/10 dark:hover:bg-white/15';

  return (
    <div className="flex h-14 items-center justify-between gap-3 md:h-16 w-full">
      <button onClick={() => scrollTo('#home')} className="group flex min-w-0 shrink-0 items-center gap-3">
        <div className="relative h-11 w-11 overflow-hidden rounded-2xl ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary">
          <Image src="/logo.webp" alt={t('landing.nav.brand')} fill className="object-cover" priority sizes="44px" />
        </div>
      </button>

      <nav
        aria-label={t('landing.nav.menu')}
        className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex"
      >
        {sectionLinks.map((link) => (
          <button
            key={link.href}
            onClick={() => scrollTo(link.href)}
            aria-current={activeHref === link.href ? 'page' : undefined}
            className={`${navLinkClass} ${activeHref === link.href ? navLinkActiveClass : ''}`}
          >
            {t(link.key)}
          </button>
        ))}

        {headerPageLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={navLinkClass}
          >
            {t(link.key)}
          </Link>
        ))}

        <div className="relative">
          <button
            type="button"
            onClick={() => setPagesOpen((value) => !value)}
            aria-expanded={pagesOpen}
            aria-controls="landing-pages-menu"
            className={`flex items-center gap-1 ${navLinkClass}`}
          >
            {t('landing.nav.pages')}
            <ChevronDown size={16} className={`transition-transform ${pagesOpen ? 'rotate-180' : ''}`} />
          </button>
          {pagesOpen ? (
            <div
              id="landing-pages-menu"
              className="absolute start-0 top-full mt-3 grid w-[34rem] grid-cols-2 gap-2 rounded-3xl border border-cyan-950/10 bg-white p-4 text-start shadow-2xl shadow-cyan-950/10 dark:border-white/10 dark:bg-navy-950"
            >
              {pageLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setPagesOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-primary/10 hover:text-primary dark:text-slate-100"
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </nav>

      <div className="hidden items-center gap-2 xl:flex">
        {/* One primary action in the header. These two sat side by side as
            near-equal buttons - a filled CTA next to a tinted, ringed,
            bordered CTA - so neither read as the main next step. Booking stays
            the filled action; the quote request is still one click away, now
            as a quiet link. */}
        <button
          type="button"
          onClick={onOpenLead}
          className="rounded-xl px-3 py-2.5 text-sm font-bold text-[var(--text-muted)] underline-offset-4 transition-colors duration-200 hover:text-primary hover:underline"
        >
          {t('landing.nav.quote')}
        </button>
        <button
          type="button"
          onClick={onOpenBooking}
          className="premium-button touch-lift rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary shadow-sm shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          {t('landing.nav.book_consultation')}
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="hidden items-center rounded-2xl border border-cyan-950/10 bg-white/70 p-1 dark:border-white/10 dark:bg-white/5 sm:flex">
          <button
            type="button"
            onClick={() => setLanguage('ar')}
            className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors ${language === 'ar' ? 'bg-primary text-on-primary' : 'text-slate-600 dark:text-slate-300'}`}
          >
            AR
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors ${language === 'en' ? 'bg-primary text-on-primary' : 'text-slate-600 dark:text-slate-300'}`}
          >
            EN
          </button>
        </div>
        <button
          id="dark-mode-toggle"
          onClick={onToggleDark}
          aria-label={t('landing.nav.toggle_dark')}
          className={iconButtonClass}
        >
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {user ? <NotificationsBell buttonClass={iconButtonClass} /> : null}

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
              aria-label={t('landing.nav.user_menu')}
            >
              <Avatar name={userDisplayName} size="md" className="cursor-pointer" />
            </button>
            {dropdownOpen && (
              <div 
                className="absolute end-0 mt-3 w-56 rounded-2xl border border-cyan-950/10 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-navy-950 z-50"
                dir={dir}
              >
                <div className="px-4 py-2 border-b border-cyan-950/5 dark:border-white/5 mb-1 text-start">
                  <p className="text-xs text-[var(--text-muted)]">{t('home.greeting')}</p>
                  <p className="text-sm font-bold text-[var(--text)] truncate">{userDisplayName}</p>
                </div>
                {profileLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center justify-start gap-2 rounded-xl px-4 py-2.5 text-start text-sm font-semibold text-slate-700 hover:bg-primary/10 hover:text-primary dark:text-slate-200 transition-colors ${
                        index === 0 ? 'border-t border-cyan-950/5 dark:border-white/5 mt-1 pt-2' : ''
                      }`}
                    >
                      <Icon size={16} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-start gap-2 rounded-xl px-4 py-2.5 text-start text-sm font-semibold text-danger hover:bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] transition-colors"
                >
                  <LogOut size={16} />
                  <span>{t('more.signout')}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={onOpenAuth}
              className="touch-lift hidden items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 dark:bg-white/10 dark:text-slate-100 dark:shadow-none dark:ring-1 dark:ring-white/10 dark:hover:bg-white/15 sm:flex"
            >
              <LogIn size={17} />
              {t('auth.login_action')}
            </button>
          </>
        )}

        <Link
          href="/blogs"
          className={`hidden lg:grid xl:hidden ${iconButtonClass}`}
          aria-label={t('landing.nav.blog')}
        >
          <FileText size={18} />
        </Link>
      </div>
    </div>
  );
}

// Rendered only for a logged-in user, so guests never see a badge or trigger a request.
function NotificationsBell({ buttonClass }: { buttonClass: string }) {
  const { t, dir, language } = useTranslation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { unreadCount, unreadNotifications, isUnreadError, isLoadingUnreadCount } = useNotificationBadgeCount();
  const notifications = unreadNotifications.slice(0, 4).map((item) => mapApiNotification(item, language));
  const markRead = useMutation({
    mutationFn: (id: string) => markNotificationRead(id, language),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`relative ${buttonClass}`}
        aria-label={t('notif.title')}
      >
        <Bell size={18} />
        {unreadCount > 0 ? (
          <span className="absolute -end-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-black text-on-primary ring-2 ring-[var(--surface)]">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          className="absolute end-0 mt-3 w-80 rounded-3xl border border-cyan-950/10 bg-white p-3 shadow-2xl dark:border-white/10 dark:bg-navy-950 z-50"
          dir={dir}
        >
          <div className={`mb-2 flex items-center justify-between gap-3 px-2 ${dir === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <div>
              <p className="text-sm font-black text-[var(--text)]">{t('notif.title')}</p>
              <p className="text-xs text-[var(--text-muted)]">{t('landing.nav.notifications_hint')}</p>
            </div>
            <Bell size={18} className="text-primary" />
          </div>

          {isLoadingUnreadCount ? (
            <p className="px-2 py-4 text-center text-xs text-[var(--text-muted)]">{t('Loading...')}</p>
          ) : isUnreadError ? (
            <p className="px-2 py-4 text-center text-xs text-danger">{t('Unable to load notifications.')}</p>
          ) : notifications.length === 0 ? (
            <p className="px-2 py-4 text-center text-xs text-[var(--text-muted)]">{t('notif.empty')}</p>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-2"
                >
                  <div className={`flex items-start gap-2 ${dir === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'}`}>
                    <Link
                      href="/profile?tab=notification"
                      onClick={() => {
                        markRead.mutate(notification.id);
                        setOpen(false);
                      }}
                      className="min-w-0 flex-1 rounded-xl px-2 py-1 transition-colors hover:bg-primary/10"
                    >
                      <p className="truncate text-sm font-bold text-[var(--text)]">{notification.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-muted)]">{notification.message}</p>
                    </Link>
                    <button
                      type="button"
                      onClick={() => markRead.mutate(notification.id)}
                      disabled={markRead.isPending}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:text-success disabled:opacity-40"
                      aria-label={t('Mark as read')}
                      title={t('Mark as read')}
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            href="/profile?tab=notification"
            onClick={() => setOpen(false)}
            className="mt-3 flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-xs font-bold text-[var(--text)] transition-colors hover:text-primary"
          >
            {t('landing.nav.view_all_notifications')}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
