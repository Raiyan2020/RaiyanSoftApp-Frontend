'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authService, User } from '@/lib/auth-service';
import { sectionLinks } from './NavbarLinks';

export function useNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  // Section links are home-page anchors; off the home page none is active.
  const [activeHref, setActiveHref] = useState(pathname === '/' ? '#home' : '');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = authService.subscribe(({ user }) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Arriving from another page via `/#services`: client navigation doesn't
  // reliably land on the anchor, so scroll to it once the sections exist.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, [pathname]);

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
    else router.push(`/${href}`); // section lives on the home page
  };

  return {
    scrolled,
    menuOpen,
    setMenuOpen,
    pagesOpen,
    setPagesOpen,
    activeHref,
    user,
    scrollTo,
  };
}
