'use client';

import { Menu, Moon, Sun, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/lib/site';
import { trackPublicEvent } from '@/lib/analytics';
import { translateMessage } from '@/lib/i18n-utils';
import { persistTheme, readStoredTheme } from '@/lib/theme';
import { useTranslation } from '@/lib/i18nContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Works', href: '/portfolio' },
  { label: 'Blog', href: '/blogs' },
  { label: 'Blog Categories', href: '/blogs/categories' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Consultation', href: '/consultation' },
  { label: 'Contact Us', href: '/contact' },
];

export default function PublicNavigation() {
  const pathname = usePathname();
  const { language, setLanguage } = useTranslation();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  // Close the mobile menu when the route changes. Adjusted during render
  // (comparing against the previous pathname) instead of in an effect.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    // Genuine mount-time sync: the persisted theme lives in localStorage,
    // which isn't available on the server, so it can only be read once the
    // component mounts on the client.
    const nextDark = readStoredTheme() === 'dark';
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial state must come from client-only storage; there is no render-time value to compute this from.
    setDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
  }, []);

  const toggleDark = () => {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    persistTheme(nextDark ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-xl dark:bg-navy-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-primary/30">
            <Image src="/logo.webp" alt={siteConfig.name} fill className="object-cover" sizes="40px" priority />
          </span>
          <span className="truncate text-base font-black text-[var(--text)]">{siteConfig.name}</span>
        </Link>

        <nav aria-label={translateMessage('Public Navigation')} className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                }`}
              >
                {translateMessage(link.label)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 dark:bg-white/5">
            <button
              type="button"
              onClick={() => setLanguage('ar')}
              aria-pressed={language === 'ar'}
              className={`min-h-8 rounded-xl px-2.5 text-xs font-bold transition-colors ${
                language === 'ar' ? 'bg-primary text-on-primary' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              AR
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              aria-pressed={language === 'en'}
              className={`min-h-8 rounded-xl px-2.5 text-xs font-bold transition-colors ${
                language === 'en' ? 'bg-primary text-on-primary' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              EN
            </button>
          </div>
          <button
            type="button"
            onClick={toggleDark}
            aria-label={translateMessage('Toggle Dark Mode')}
            className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition hover:border-primary hover:text-primary"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            className="hidden rounded-xl bg-primary px-4 py-2 text-sm font-black text-on-primary transition hover:bg-primary-dark sm:inline-flex"
            href="/quote"
            onClick={() => trackPublicEvent('cta_click', { location: 'public_navigation', href: '/quote', label: 'Get a Quote' })}
          >
            {translateMessage('Get a Quote')}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={translateMessage('Menu')}
            aria-expanded={open}
            aria-controls="public-mobile-menu"
            className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition hover:border-primary hover:text-primary lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div id="public-mobile-menu" className={`border-t border-[var(--border)] lg:hidden ${open ? 'block' : 'hidden'}`}>
        <nav aria-label={translateMessage('Public Mobile Navigation')} className="mx-auto grid max-w-7xl gap-1 px-4 py-4 sm:px-6">
          {navLinks.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-xl px-3 py-3 text-sm font-bold transition ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-[var(--text)] hover:bg-[var(--surface-2)]'
                }`}
              >
                {translateMessage(link.label)}
              </Link>
            );
          })}
          <Link
            className="mt-2 rounded-xl bg-primary px-4 py-3 text-center text-sm font-black text-on-primary transition hover:bg-primary-dark"
            href="/quote"
            onClick={() => trackPublicEvent('cta_click', { location: 'public_mobile_navigation', href: '/quote', label: 'Get a Quote' })}
          >
            {translateMessage('Get a Quote')}
          </Link>
        </nav>
      </div>
    </header>
  );
}
