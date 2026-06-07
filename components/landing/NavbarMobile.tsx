import React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';
import { authService, User } from '@/lib/auth-service';
import { guestStore } from '@/lib/guestStore';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { sectionLinks, pageLinks } from './NavbarLinks';
import Avatar from '@/components/ui/avatar';


interface NavbarMobileProps {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  activeHref: string;
  scrollTo: (href: string) => void;
  onOpenAuth: () => void;
  onOpenBooking: () => void;
  onOpenLead: () => void;
}

export default function NavbarMobile({
  menuOpen,
  setMenuOpen,
  user,
  activeHref,
  scrollTo,
  onOpenAuth,
  onOpenBooking,
  onOpenLead,
}: NavbarMobileProps) {
  const { t, dir } = useTranslation();

  return (
    <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
      <SheetTrigger asChild>
        <button
          id="mobile-menu-btn"
          className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-800 shadow-sm ring-1 ring-slate-200/80 transition-colors hover:bg-slate-50 hover:text-primary dark:bg-white/10 dark:text-slate-200 dark:shadow-none dark:ring-white/10 dark:hover:bg-white/15 xl:hidden"
          aria-label={t('landing.nav.menu')}
        >
          <Menu size={22} />
        </button>
      </SheetTrigger>
      <SheetContent side="start" dir={dir} className="bg-[#0b0f19]/95 backdrop-blur-2xl border-white/5 p-6 max-h-screen overflow-y-auto no-scrollbar">
        <SheetTitle className="sr-only">{t('landing.nav.menu')}</SheetTitle>
        <SheetDescription className="sr-only">Mobile Menu Options</SheetDescription>
        
        <div className="space-y-6 pt-4 text-right">
          <div>
            <p className="mb-2 px-2 text-xs font-black text-slate-400">{t('landing.nav.sections_title')}</p>
            <div className="grid grid-cols-2 gap-2">
              {sectionLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={`rounded-2xl px-4 py-3 text-right text-sm font-bold transition-colors hover:bg-primary/10 hover:text-primary ${
                    activeHref === link.href ? 'bg-primary/10 text-primary' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {t(link.key)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 px-2 text-xs font-black text-slate-400">{t('landing.nav.pages_title')}</p>
            <div className="grid grid-cols-2 gap-2">
              {pageLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-right text-sm font-bold text-slate-700 transition-colors hover:bg-primary/10 hover:text-primary dark:text-slate-200"
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 px-2 text-xs font-black text-slate-400">{t('landing.nav.actions_title')}</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenLead();
                }}
                className="touch-lift rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3 text-center text-sm font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-white"
              >
                {t('landing.nav.quote')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenBooking();
                }}
                className="premium-button touch-lift rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-4 py-3 text-center text-sm font-bold text-white shadow-md shadow-primary/25 transition-all duration-200"
              >
                {t('landing.nav.book_consultation')}
              </button>
            </div>
          </div>

          <div className="grid gap-2 grid-cols-2 pt-2">
            {user ? (
              <div className="col-span-2 space-y-2 text-right">
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 mb-2 justify-end">
                  <div className="min-w-0 text-right flex-1">
                    <p className="text-xs text-slate-400">{t('home.greeting')}</p>
                    <p className="text-sm font-bold text-white truncate">{`${user.first_name} ${user.last_name}`}</p>
                  </div>
                  <Avatar name={`${user.first_name} ${user.last_name}`} size="md" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/home"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-bold text-slate-200 transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <span>{t('home.my_apps')}</span>
                  </Link>
                  <Link
                    href="/appointments"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-bold text-slate-200 transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <span>{t('appt.title')}</span>
                  </Link>
                  <Link
                    href="/support"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-bold text-slate-200 transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <span>{t('status.support')}</span>
                  </Link>
                  <Link
                    href="/notifications"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-bold text-slate-200 transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <span>{t('notif.title')}</span>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-bold text-slate-200 transition-colors hover:bg-primary/10 hover:text-primary col-span-2"
                  >
                    <span>{t('more.view_profile')}</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      authService.clearUserSession();
                      guestStore.setGuest(false);
                      window.location.href = '/login';
                    }}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20 col-span-2"
                  >
                    <span>{t('more.signout')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="touch-lift rounded-2xl border border-cyan-950/10 px-4 py-3 text-center font-bold text-slate-800 transition-all duration-200 hover:border-primary hover:text-primary dark:border-white/10 dark:text-slate-200 col-span-2"
                >
                  {t('auth.login_action')}
                </button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
