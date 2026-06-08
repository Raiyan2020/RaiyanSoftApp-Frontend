import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronDown, 
  CheckCircle2,
  Eye,
  FileText, 
  Sun, 
  Moon, 
  LogIn, 
  Home,
  MessageCircle,
  Calendar,
  Bell,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';
import { authService, User } from '@/lib/auth-service';
import { guestStore } from '@/lib/guestStore';
import { logoutUser } from '@/features/auth/api/user-auth-api';
import { sectionLinks, pageLinks, headerPageLinks } from './NavbarLinks';
import Avatar from '@/components/ui/avatar';
import { profileRecords } from '@/components/profile/profile-records-data';

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
  const { t, dir } = useTranslation();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [completedNotifications, setCompletedNotifications] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const headerNotifications = profileRecords
    .filter((record) => record.type === 'notification')
    .slice(0, 4);
  const unreadNotificationCount = headerNotifications.filter(
    (record) => !completedNotifications.includes(record.id) && record.status !== 'completed'
  ).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
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
      router.push('/login');
    }
  };

  const markNotificationComplete = (recordId: string) => {
    setCompletedNotifications((current) =>
      current.includes(recordId) ? current : [...current, recordId]
    );
  };

  const navLinkClass =
    'rounded-full px-3 py-2 text-sm font-bold text-slate-900 transition-colors duration-200 hover:bg-slate-900/[0.06] hover:text-primary dark:text-slate-100 dark:hover:bg-white/10';
  const navLinkActiveClass = 'bg-primary/12 text-primary shadow-sm ring-1 ring-primary/25 dark:bg-primary/18 dark:ring-primary/15';
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
              className="absolute left-0 top-full mt-3 grid w-[34rem] grid-cols-2 gap-2 rounded-3xl border border-cyan-950/10 bg-white p-4 text-right shadow-2xl shadow-cyan-950/12 dark:border-white/10 dark:bg-navy-950"
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
        <button
          type="button"
          onClick={onOpenLead}
          className="touch-lift rounded-2xl border border-primary/35 bg-primary/8 px-4 py-2.5 text-sm font-bold text-primary shadow-sm ring-1 ring-primary/15 transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white dark:border-primary/25 dark:bg-primary/10"
        >
          {t('landing.nav.quote')}
        </button>
        <button
          type="button"
          onClick={onOpenBooking}
          className="premium-button touch-lift rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5"
        >
          {t('landing.nav.book_consultation')}
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          id="dark-mode-toggle"
          onClick={onToggleDark}
          aria-label={t('landing.nav.toggle_dark')}
          className={iconButtonClass}
        >
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            className={`relative ${iconButtonClass}`}
            aria-label={dir === 'rtl' ? 'الإشعارات' : 'Notifications'}
          >
            <Bell size={18} />
            {unreadNotificationCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-black text-white ring-2 ring-[var(--surface)]">
                {unreadNotificationCount}
              </span>
            ) : null}
          </button>

          {notificationsOpen ? (
            <div
              className={`absolute ${dir === 'rtl' ? 'left-0' : 'right-0'} mt-3 w-80 rounded-3xl border border-cyan-950/10 bg-white p-3 shadow-2xl dark:border-white/10 dark:bg-navy-950 z-50`}
              dir={dir}
            >
              <div className={`mb-2 flex items-center justify-between gap-3 px-2 ${dir === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <div>
                  <p className="text-sm font-black text-[var(--text)]">{dir === 'rtl' ? 'الإشعارات' : 'Notifications'}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {dir === 'rtl' ? 'اضغط على أي إشعار لفتح تفاصيله' : 'Click any notification to open its details'}
                  </p>
                </div>
                <Bell size={18} className="text-primary" />
              </div>

              <div className="space-y-2">
                {headerNotifications.map((record) => {
                  const isComplete = completedNotifications.includes(record.id) || record.status === 'completed';

                  return (
                    <div
                      key={record.id}
                      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-2 ${isComplete ? 'opacity-65' : ''}`}
                    >
                      <div className={`flex items-start gap-2 ${dir === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'}`}>
                        <Link
                          href={`/profile?tab=notification&record=${record.id}`}
                          onClick={() => setNotificationsOpen(false)}
                          className="min-w-0 flex-1 rounded-xl px-2 py-1 transition-colors hover:bg-primary/10"
                        >
                          <p className="truncate text-sm font-bold text-[var(--text)]">{record.title}</p>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-muted)]">{record.description}</p>
                        </Link>
                        <button
                          type="button"
                          onClick={() => markNotificationComplete(record.id)}
                          disabled={isComplete}
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors hover:text-emerald-400 disabled:opacity-40"
                          aria-label={dir === 'rtl' ? 'تمييز كمكتمل' : 'Mark complete'}
                          title={dir === 'rtl' ? 'تمييز كمكتمل' : 'Mark complete'}
                        >
                          {isComplete ? <CheckCircle2 size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/profile?tab=notification"
                onClick={() => setNotificationsOpen(false)}
                className="mt-3 flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-xs font-bold text-[var(--text)] transition-colors hover:text-primary"
              >
                {dir === 'rtl' ? 'عرض كل الإشعارات' : 'View all notifications'}
              </Link>
            </div>
          ) : null}
        </div>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
              aria-label="User menu"
            >
              <Avatar name={`${user.first_name} ${user.last_name}`} size="md" className="cursor-pointer" />
            </button>
            {dropdownOpen && (
              <div 
                className={`absolute ${dir === 'rtl' ? 'left-0' : 'right-0'} mt-3 w-56 rounded-2xl border border-cyan-950/10 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-navy-950 z-50`}
              >
                <div className="px-4 py-2 border-b border-cyan-950/5 dark:border-white/5 mb-1 text-right">
                  <p className="text-xs text-[var(--text-muted)]">{t('home.greeting')}</p>
                  <p className="text-sm font-bold text-[var(--text)] truncate">{`${user.first_name} ${user.last_name}`}</p>
                </div>
                <Link
                  href="/home"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-primary/10 hover:text-primary dark:text-slate-200 transition-colors justify-end"
                >
                  <span>{t('home.my_apps')}</span>
                  <Home size={16} />
                </Link>
                <Link
                  href="/appointments"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-primary/10 hover:text-primary dark:text-slate-200 transition-colors justify-end"
                >
                  <span>{t('appt.title')}</span>
                  <Calendar size={16} />
                </Link>
                <Link
                  href="/support"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-primary/10 hover:text-primary dark:text-slate-200 transition-colors justify-end"
                >
                  <span>{t('status.support')}</span>
                  <MessageCircle size={16} />
                </Link>
                <Link
                  href="/notifications"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-primary/10 hover:text-primary dark:text-slate-200 transition-colors justify-end"
                >
                  <span>{t('notif.title')}</span>
                  <Bell size={16} />
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-primary/10 hover:text-primary dark:text-slate-200 transition-colors border-t border-cyan-950/5 dark:border-white/5 mt-1 pt-2 justify-end"
                >
                  <span>{t('more.view_profile')}</span>
                  <UserIcon size={16} />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-right flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors justify-end"
                >
                  <span>{t('more.signout')}</span>
                  <LogOut size={16} />
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
          href="/blog"
          className={`hidden lg:grid xl:hidden ${iconButtonClass}`}
          aria-label={t('landing.nav.blog')}
        >
          <FileText size={18} />
        </Link>
      </div>
    </div>
  );
}
