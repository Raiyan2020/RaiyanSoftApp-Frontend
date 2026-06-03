'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BriefcaseBusiness, ChevronDown, FileText, Sun, Moon, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';
import { User } from '@/lib/auth-service';
import { sectionLinks, pageLinks } from './NavbarLinks';

interface NavbarDesktopProps {
  dark: boolean;
  onToggleDark: () => void;
  user: User | null;
  activeHref: string;
  pagesOpen: boolean;
  setPagesOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scrollTo: (href: string) => void;
}

export default function NavbarDesktop({
  dark,
  onToggleDark,
  user,
  activeHref,
  pagesOpen,
  setPagesOpen,
  scrollTo,
}: NavbarDesktopProps) {
  const { t } = useTranslation();

  return (
    <div className="flex h-16 items-center justify-between gap-3 md:h-20 w-full">
      <button onClick={() => scrollTo('#home')} className="group flex min-w-0 shrink-0 items-center gap-3">
        <div className="relative h-11 w-11 overflow-hidden rounded-2xl ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary">
          <Image src="/logo.webp" alt={t('landing.nav.brand')} fill className="object-cover" priority sizes="44px" />
        </div>
      </button>

      <nav aria-label={t('landing.nav.menu')} className="hidden items-center gap-1 rounded-full border border-cyan-950/10 bg-white/62 px-3 py-2 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 xl:flex">
        {sectionLinks.map((link) => (
          <button
            key={link.href}
            onClick={() => scrollTo(link.href)}
            aria-current={activeHref === link.href ? 'page' : undefined}
            className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-primary/10 hover:text-primary ${
              activeHref === link.href ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {t(link.key)}
          </button>
        ))}

        <div className="relative">
          <button
            type="button"
            onClick={() => setPagesOpen((value) => !value)}
            aria-expanded={pagesOpen}
            aria-controls="landing-pages-menu"
            className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary dark:text-slate-300"
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
                  className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-primary/10 hover:text-primary dark:text-slate-200"
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </nav>

      <div className="flex shrink-0 items-center gap-2">
        <button
          id="dark-mode-toggle"
          onClick={onToggleDark}
          aria-label={t('landing.nav.toggle_dark')}
          className="grid h-10 w-10 place-items-center rounded-2xl bg-white/75 text-slate-600 shadow-sm ring-1 ring-cyan-950/10 transition-all duration-200 hover:bg-primary/10 hover:text-primary dark:bg-white/10 dark:text-slate-300 dark:ring-white/10"
        >
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {user ? (
          <>
            <Link
              href="/home"
              className="premium-button touch-lift hidden items-center gap-2 rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-primary/35 sm:flex"
            >
              <LayoutDashboard size={17} />
              {t('landing.nav.dashboard')}
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="touch-lift hidden items-center gap-2 rounded-2xl bg-white/75 px-5 py-3 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-cyan-950/10 transition-all duration-200 hover:bg-primary/10 hover:text-primary dark:bg-white/10 dark:text-slate-300 dark:ring-white/10 sm:flex"
            >
              <LogIn size={17} />
              {t('auth.login_action')}
            </Link>

            <Link
              href="/signup"
              className="premium-button touch-lift hidden items-center gap-2 rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-primary/35 sm:flex"
            >
              <UserPlus size={17} />
              {t('auth.signup_action')}
            </Link>
          </>
        )}

        <Link
          href="/blog"
          className="hidden h-10 w-10 place-items-center rounded-2xl bg-white/75 text-slate-600 shadow-sm ring-1 ring-cyan-950/10 transition-all duration-200 hover:bg-primary/10 hover:text-primary dark:bg-white/10 dark:text-slate-300 dark:ring-white/10 lg:grid xl:hidden"
          aria-label={t('landing.nav.blog')}
        >
          <FileText size={18} />
        </Link>
      </div>
    </div>
  );
}
