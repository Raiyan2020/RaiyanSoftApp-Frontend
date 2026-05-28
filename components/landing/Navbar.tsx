'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const navLinks = [
  { label: 'الرئيسية', href: '#home' },
  { label: 'خدماتنا', href: '#services' },
  { label: 'القطاعات', href: '#sectors' },
  { label: 'أعمالنا', href: '#works' },
  { label: 'العروض', href: '#packages' },
  { label: 'الأسئلة', href: '#faq' },
];

export default function Navbar({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('#home');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter((section): section is Element => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveHref(`#${visible.target.id}`);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-cyan-950/5 bg-white/88 shadow-lg shadow-cyan-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-navy-950/88'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 md:h-20">
          <button onClick={() => scrollTo('#home')} className="group flex shrink-0 items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-2xl ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary">
              <Image src="/logo.webp" alt="رايان سوفت" fill className="object-cover" priority />
            </div>
            <span className="hidden font-bold text-lg text-slate-900 transition-colors duration-300 group-hover:text-primary dark:text-white sm:block">
              رايان سوفت
            </span>
          </button>

          <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-5 rounded-full border border-cyan-950/10 bg-white/58 px-5 py-3 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 lg:flex">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                aria-current={activeHref === link.href ? 'page' : undefined}
                className={`nav-link whitespace-nowrap text-sm font-semibold transition-colors duration-200 hover:text-primary dark:hover:text-primary ${
                  activeHref === link.href ? 'text-primary' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <button
              id="dark-mode-toggle"
              onClick={onToggleDark}
              aria-label="تبديل الوضع الليلي"
              className="rounded-2xl bg-white/75 p-2.5 text-slate-600 shadow-sm ring-1 ring-cyan-950/10 transition-all duration-200 hover:bg-primary/10 hover:text-primary dark:bg-white/10 dark:text-slate-300 dark:ring-white/10"
            >
              {dark ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => scrollTo('#contact')}
              className="premium-button touch-lift hidden items-center gap-2 rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-primary/35 sm:flex"
            >
              ابدأ مشروعك
            </button>

            <button
              id="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-2xl bg-white/75 p-2.5 text-slate-600 shadow-sm ring-1 ring-cyan-950/10 transition-colors hover:text-primary dark:bg-white/10 dark:text-slate-300 dark:ring-white/10 lg:hidden"
              aria-label="القائمة"
              aria-expanded={menuOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-300 lg:hidden ${menuOpen ? 'max-h-[34rem] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="mx-4 mb-4 flex flex-col gap-2 rounded-3xl border border-cyan-950/10 bg-white/95 p-4 shadow-xl shadow-cyan-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-navy-950/95">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              aria-current={menuOpen && activeHref === link.href ? 'page' : undefined}
              className={`rounded-2xl px-4 py-3 text-right text-sm font-bold transition-colors hover:bg-primary/10 hover:text-primary ${
                activeHref === link.href ? 'bg-primary/10 text-primary' : 'text-slate-700 dark:text-slate-200'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('#contact')}
            className="premium-button touch-lift mt-2 rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-4 py-3 font-bold text-white shadow-lg shadow-primary/25 transition-all duration-200"
          >
            احجز استشارة مجانية
          </button>
        </div>
      </div>
    </header>
  );
}
