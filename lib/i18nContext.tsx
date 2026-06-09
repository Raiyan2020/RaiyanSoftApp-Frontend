"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from './translations';

import { DirectionProvider } from '@radix-ui/react-direction';

type Language = 'en' | 'ar';
type TranslationKey = keyof typeof translations.en;

interface I18nContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Match the server-rendered default first, then apply the saved preference
  // after mount to avoid hydration mismatches between Arabic and English text.
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    try {
      const storedLang = localStorage.getItem('rs_lang') as Language;
      if (storedLang && (storedLang === 'en' || storedLang === 'ar')) {
        setLanguageState(storedLang);
      }
    } catch (e) {
      // Ignore localStorage errors (e.g. private mode)
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rs_lang', lang);
    }
  };

  const effectiveLanguage = language;
  const dir = effectiveLanguage === 'ar' ? 'rtl' : 'ltr';

  // Apply direction to HTML element immediately
  useEffect(() => {
    document.documentElement.lang = effectiveLanguage;
    document.documentElement.dir = dir;
  }, [effectiveLanguage, dir]);

  const t = (key: string): string => {
    // @ts-ignore
    return translations[effectiveLanguage][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language: effectiveLanguage, setLanguage, t, dir }}>
      <DirectionProvider dir={dir}>
        {children}
      </DirectionProvider>
    </I18nContext.Provider>
  );
};


export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
