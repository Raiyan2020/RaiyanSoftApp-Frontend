import { useState, useEffect } from 'react';
import { useReducedMotion, type Variants } from 'framer-motion';
import { persistTheme, readStoredTheme } from '@/lib/theme';

export function useLanding() {
  const [dark, setDark] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Persist theme preference, defaulting to light mode. Genuine mount-time
  // sync: the persisted theme lives in localStorage, which isn't available
  // on the server, so it can only be read once the component mounts.
  useEffect(() => {
    const isDark = readStoredTheme() === 'dark';
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial state must come from client-only storage; there is no render-time value to compute this from.
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
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
    document.documentElement.classList.toggle('dark', next);
    persistTheme(next ? 'dark' : 'light');
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

  return {
    dark,
    scrollProgress,
    shouldReduceMotion,
    toggleDark,
    pageVariants,
    sectionVariants,
  };
}
