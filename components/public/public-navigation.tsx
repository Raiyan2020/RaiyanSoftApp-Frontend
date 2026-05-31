'use client';

import { Menu, Moon, Sun, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/lib/site';
import { trackPublicEvent } from '@/lib/analytics';

const navLinks = [
  { label: 'الرئيسية', href: '/' },
  { label: 'من نحن', href: '/about' },
  { label: 'الخدمات', href: '/services' },
  { label: 'الأعمال', href: '/portfolio' },
  { label: 'المدونة', href: '/blog' },
  { label: 'الأسعار', href: '/pricing' },
  { label: 'استشارة', href: '/consultation' },
  { label: 'تواصل معنا', href: '/contact' },
];

export default function PublicNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const nextDark = saved === 'dark';
    setDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
  }, []);

  const toggleDark = () => {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-950/10 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-navy-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-primary/30">
            <Image src="/logo.webp" alt={siteConfig.name} fill className="object-cover" sizes="40px" priority />
          </span>
          <span className="truncate text-base font-black text-slate-950 dark:text-white">{siteConfig.name}</span>
        </Link>

        <nav aria-label="التنقل العام" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleDark}
            aria-label="تبديل الوضع الليلي"
            className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-950/10 bg-white text-slate-700 transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-black text-white transition hover:bg-primary-dark sm:inline-flex"
            href="/quote"
            onClick={() => trackPublicEvent('cta_click', { location: 'public_navigation', href: '/quote', label: 'اطلب عرض سعر' })}
          >
            اطلب عرض سعر
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="القائمة"
            aria-expanded={open}
            aria-controls="public-mobile-menu"
            className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-950/10 bg-white text-slate-700 transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-200 lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div id="public-mobile-menu" className={`border-t border-cyan-950/10 lg:hidden dark:border-white/10 ${open ? 'block' : 'hidden'}`}>
        <nav aria-label="التنقل العام للجوال" className="mx-auto grid max-w-7xl gap-1 px-4 py-4 sm:px-6">
          {navLinks.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-lg px-3 py-3 text-sm font-bold transition ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            className="mt-2 rounded-lg bg-primary px-4 py-3 text-center text-sm font-black text-white transition hover:bg-primary-dark"
            href="/quote"
            onClick={() => trackPublicEvent('cta_click', { location: 'public_mobile_navigation', href: '/quote', label: 'اطلب عرض سعر' })}
          >
            اطلب عرض سعر
          </Link>
        </nav>
      </div>
    </header>
  );
}
