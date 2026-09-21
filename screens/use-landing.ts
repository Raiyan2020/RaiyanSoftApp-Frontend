import { useState, useEffect } from 'react';
import { persistTheme, readStoredTheme } from '@/lib/theme';

export function useLanding() {
  const [dark, setDark] = useState(false);

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
    let frameId: number | null = null;

    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
      document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
      frameId = null;
    };

    const scheduleProgressUpdate = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(updateProgress);
    };

    scheduleProgressUpdate();
    window.addEventListener('scroll', scheduleProgressUpdate, { passive: true });
    window.addEventListener('resize', scheduleProgressUpdate);
    return () => {
      window.removeEventListener('scroll', scheduleProgressUpdate);
      window.removeEventListener('resize', scheduleProgressUpdate);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    persistTheme(next ? 'dark' : 'light');
  };

  return {
    dark,
    toggleDark,
  };
}
