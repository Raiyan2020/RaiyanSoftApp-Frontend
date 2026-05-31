'use client';
import { useState, useEffect } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import HeroBanner from '@/components/landing/HeroBanner';
import Services from '@/components/landing/Services';
import Sectors from '@/components/landing/Sectors';
import Works from '@/components/landing/Works';
import Packages from '@/components/landing/Packages';
import Partners from '@/components/landing/Partners';
import Insights from '@/components/landing/Insights';
import FAQ from '@/components/landing/FAQ';
import FinalCta from '@/components/landing/FinalCta';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  const [dark, setDark] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Persist theme preference, defaulting to light mode
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
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

  const pageVariants: Variants | undefined = shouldReduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
          },
        },
      };

  const sectionVariants: Variants | undefined = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <a href="#main-content" className="skip-link">تجاوز إلى المحتوى</a>
      <div className="scroll-progress" style={{ '--scroll-progress': `${scrollProgress}%` } as React.CSSProperties} />
      <Navbar dark={dark} onToggleDark={toggleDark} />
      <motion.main id="main-content" variants={pageVariants} initial={shouldReduceMotion ? false : 'hidden'} animate="visible">
        <motion.div variants={sectionVariants}><HeroBanner /></motion.div>
        <motion.div variants={sectionVariants}><Services /></motion.div>
        <motion.div variants={sectionVariants}><Sectors /></motion.div>
        <motion.div variants={sectionVariants}><Works /></motion.div>
        <motion.div variants={sectionVariants}><Packages /></motion.div>
        <motion.div variants={sectionVariants}><Partners /></motion.div>
        <motion.div variants={sectionVariants}><Insights /></motion.div>
        <motion.div variants={sectionVariants}><FAQ /></motion.div>
        <motion.div variants={sectionVariants}><FinalCta /></motion.div>
        <motion.div variants={sectionVariants}><Contact /></motion.div>
      </motion.main>
      <Footer />
    </div>
  );
}
