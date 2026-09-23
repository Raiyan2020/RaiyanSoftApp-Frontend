"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { persistTheme, readStoredTheme } from './theme';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark'); // Default to dark theme as requested

  // Genuine mount-time sync: the persisted theme lives in localStorage,
  // which isn't available on the server, so it can only be read once this
  // provider mounts on the client.
  useEffect(() => {
    const savedTheme = readStoredTheme();
    if (savedTheme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- initial state must come from client-only storage; there is no render-time value to compute this from.
      setThemeState(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Fallback to dark if no saved preference
      document.documentElement.classList.add('dark');
      persistTheme('dark');
    }
  }, []);

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    persistTheme(nextTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/** For shared UI (e.g. the toaster) that also renders in trees without ThemeProvider. */
export const useOptionalTheme = () => useContext(ThemeContext);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
