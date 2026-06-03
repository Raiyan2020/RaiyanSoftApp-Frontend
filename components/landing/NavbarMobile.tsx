'use client';

import React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';
import { User } from '@/lib/auth-service';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { sectionLinks, pageLinks } from './NavbarLinks';

interface NavbarMobileProps {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  activeHref: string;
  scrollTo: (href: string) => void;
}

export default function NavbarMobile({
  menuOpen,
  setMenuOpen,
  user,
  activeHref,
  scrollTo,
}: NavbarMobileProps) {
  const { t, dir } = useTranslation();

  return (
    <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
      <SheetTrigger asChild>
        <button
          id="mobile-menu-btn"
          className="grid h-10 w-10 place-items-center rounded-2xl bg-white/75 text-slate-600 shadow-sm ring-1 ring-cyan-950/10 transition-colors hover:text-primary dark:bg-white/10 dark:text-slate-300 dark:ring-white/10 xl:hidden"
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

          <div className="grid gap-2 grid-cols-2 pt-2">
            {user ? (
              <Link
                href="/home"
                onClick={() => setMenuOpen(false)}
                className="premium-button touch-lift rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-4 py-3 text-center font-bold text-white shadow-lg shadow-primary/25 transition-all duration-200"
              >
                {t('landing.nav.dashboard')}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="touch-lift rounded-2xl border border-cyan-950/10 px-4 py-3 text-center font-bold text-slate-800 transition-all duration-200 hover:border-primary hover:text-primary dark:border-white/10 dark:text-slate-200"
                >
                  {t('auth.login_action')}
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="premium-button touch-lift rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-4 py-3 text-center font-bold text-white shadow-lg shadow-primary/25 transition-all duration-200"
                >
                  {t('auth.signup_action')}
                </Link>
              </>
            )}
            <Link
              href="/quote"
              onClick={() => setMenuOpen(false)}
              className="touch-lift rounded-2xl border border-cyan-950/10 px-4 py-3 text-center font-bold text-slate-800 transition-all duration-200 hover:border-primary hover:text-primary dark:border-white/10 dark:text-slate-200"
            >
              {t('landing.nav.quote')}
            </Link>
            <Link
              href="/consultation"
              onClick={() => setMenuOpen(false)}
              className="touch-lift rounded-2xl border border-cyan-950/10 px-4 py-3 text-center font-bold text-slate-800 transition-all duration-200 hover:border-primary hover:text-primary dark:border-white/10 dark:text-slate-200"
            >
              {t('landing.nav.book_consultation')}
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
