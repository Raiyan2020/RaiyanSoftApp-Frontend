'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/landing/Navbar';
import HeroBanner from '@/components/landing/HeroBanner';
import Services from '@/components/landing/Services';
import Works from '@/components/landing/Works';
import Partners from '@/components/landing/Partners';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  const [dark, setDark] = useState(false);

  // Persist dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar dark={dark} onToggleDark={toggleDark} />
      <main>
        <HeroBanner />
        <Services />
        <Works />
        <Partners />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
