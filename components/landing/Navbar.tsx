'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const navLinks = [
  { label: 'الرئيسية', href: '#home' },
  { label: 'خدماتنا', href: '#services' },
  { label: 'أعمالنا', href: '#works' },
  { label: 'شركاؤنا', href: '#partners' },
  { label: 'تواصل معنا', href: '#contact' },
];

export default function Navbar({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/90 dark:bg-navy-950/90 backdrop-blur-xl shadow-lg shadow-black/5'
          : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button onClick={() => scrollTo('#home')} className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/30 group-hover:ring-primary transition-all duration-300">
              <Image src="/logo.webp" alt="رايان سوفت" fill className="object-cover" />
            </div>
            <span className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-primary transition-colors duration-300">
              رايان سوفت
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="nav-link text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              id="dark-mode-toggle"
              onClick={onToggleDark}
              aria-label="تبديل الوضع الليلي"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 dark:hover:bg-primary/10 text-slate-600 dark:text-slate-300 hover:text-primary transition-all duration-200"
            >
              {dark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* CTA */}
            <button
              onClick={() => scrollTo('#contact')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              ابدأ مشروعك
            </button>

            {/* Hamburger */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-primary"
              aria-label="القائمة"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="bg-white/95 dark:bg-navy-950/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-right text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors py-2 border-b border-slate-100 dark:border-slate-800"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('#contact')}
            className="mt-2 px-4 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold transition-all duration-200"
          >
            ابدأ مشروعك
          </button>
        </div>
      </div>
    </header>
  );
}
