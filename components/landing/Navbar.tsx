'use client';

import { BriefcaseBusiness, ChevronDown, FileText, Menu, Moon, Sun, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const sectionLinks = [
  { label: 'الرئيسية', href: '#home' },
  { label: 'خدماتنا', href: '#services' },
  { label: 'القطاعات', href: '#sectors' },
  { label: 'أعمالنا', href: '#works' },
  { label: 'العروض', href: '#packages' },
  { label: 'الأسئلة', href: '#faq' },
];

const pageLinks = [
  { label: 'من نحن', href: '/about' },
  { label: 'الخدمات', href: '/services' },
  { label: 'الأعمال', href: '/portfolio' },
  { label: 'المدونة', href: '/blog' },
  { label: 'الأسعار', href: '/pricing' },
  { label: 'استشارة', href: '/consultation' },
  { label: 'تواصل معنا', href: '/contact' },
  { label: 'الفريق', href: '/team' },
  { label: 'الشركاء', href: '/partners' },
  { label: 'الوظائف', href: '/careers' },
  { label: 'الخصوصية', href: '/privacy' },
  { label: 'الشروط', href: '/terms' },
];

export default function Navbar({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('#home');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const sections = sectionLinks
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
    setPagesOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-cyan-950/5 bg-white/90 shadow-lg shadow-cyan-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-navy-950/90'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 md:h-20">
          <button onClick={() => scrollTo('#home')} className="group flex min-w-0 shrink-0 items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-2xl ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary">
              <Image src="/logo.webp" alt="ريان سوفت" fill className="object-cover" priority sizes="44px" />
            </div>
            <span className="hidden truncate font-bold text-lg text-slate-900 transition-colors duration-300 group-hover:text-primary dark:text-white sm:block">
              ريان سوفت
            </span>
          </button>

          <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-1 rounded-full border border-cyan-950/10 bg-white/62 px-3 py-2 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5 xl:flex">
            {sectionLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                aria-current={activeHref === link.href ? 'page' : undefined}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-primary/10 hover:text-primary ${
                  activeHref === link.href ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.label}
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
                الصفحات
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
                      {link.label}
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
              aria-label="تبديل الوضع الليلي"
              className="grid h-10 w-10 place-items-center rounded-2xl bg-white/75 text-slate-600 shadow-sm ring-1 ring-cyan-950/10 transition-all duration-200 hover:bg-primary/10 hover:text-primary dark:bg-white/10 dark:text-slate-300 dark:ring-white/10"
            >
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            <Link
              href="/quote"
              className="premium-button touch-lift hidden items-center gap-2 rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-primary/35 sm:flex"
            >
              <BriefcaseBusiness size={17} />
              ابدأ مشروعك
            </Link>

            <Link
              href="/blog"
              className="hidden h-10 w-10 place-items-center rounded-2xl bg-white/75 text-slate-600 shadow-sm ring-1 ring-cyan-950/10 transition-all duration-200 hover:bg-primary/10 hover:text-primary dark:bg-white/10 dark:text-slate-300 dark:ring-white/10 lg:grid xl:hidden"
              aria-label="المدونة"
            >
              <FileText size={18} />
            </Link>

            <button
              id="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              className="grid h-10 w-10 place-items-center rounded-2xl bg-white/75 text-slate-600 shadow-sm ring-1 ring-cyan-950/10 transition-colors hover:text-primary dark:bg-white/10 dark:text-slate-300 dark:ring-white/10 xl:hidden"
              aria-label="القائمة"
              aria-expanded={menuOpen}
              aria-controls="landing-mobile-menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <div id="landing-mobile-menu" className={`overflow-hidden transition-all duration-300 xl:hidden ${menuOpen ? 'max-h-[42rem] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="mx-4 mb-4 grid gap-4 rounded-3xl border border-cyan-950/10 bg-white/95 p-4 shadow-xl shadow-cyan-950/10 backdrop-blur-xl dark:border-white/10 dark:bg-navy-950/95">
          <div>
            <p className="mb-2 px-2 text-xs font-black text-slate-400">أقسام الصفحة</p>
            <div className="grid grid-cols-2 gap-2">
              {sectionLinks.map((link) => (
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
            </div>
          </div>

          <div>
            <p className="mb-2 px-2 text-xs font-black text-slate-400">صفحات الموقع</p>
            <div className="grid grid-cols-2 gap-2">
              {pageLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-right text-sm font-bold text-slate-700 transition-colors hover:bg-primary/10 hover:text-primary dark:text-slate-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              href="/quote"
              onClick={() => setMenuOpen(false)}
              className="premium-button touch-lift rounded-2xl bg-gradient-to-l from-primary to-primary-dark px-4 py-3 text-center font-bold text-white shadow-lg shadow-primary/25 transition-all duration-200"
            >
              اطلب عرض سعر
            </Link>
            <Link
              href="/consultation"
              onClick={() => setMenuOpen(false)}
              className="touch-lift rounded-2xl border border-cyan-950/10 px-4 py-3 text-center font-bold text-slate-800 transition-all duration-200 hover:border-primary hover:text-primary dark:border-white/10 dark:text-slate-200"
            >
              احجز استشارة
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

