"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { translations } from './translations';
import { translateMessage } from './i18n-utils';
import { queryClient } from './query-client';
import {
  DEFAULT_LANGUAGE,
  getDirection,
  persistLanguage,
  readStoredLanguage,
} from './language';

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

export const I18nProvider: React.FC<{ children: ReactNode; initialLanguage?: Language }> = ({
  children,
  initialLanguage,
}) => {
  const router = useRouter();
  // The server resolves the language from the cookie, so the first client render
  // already matches and there is no Arabic flash for English users.
  const [language, setLanguageState] = useState<Language>(initialLanguage ?? DEFAULT_LANGUAGE);

  useEffect(() => {
    // Reconcile with localStorage for visitors whose preference predates the cookie.
    const stored = readStoredLanguage();
    if (stored !== language) setLanguageState(stored);
    persistLanguage(stored);
    // Runs once: this only backfills the cookie from a legacy localStorage value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    persistLanguage(lang);
    // Server components read the language from the cookie, so the rendered
    // server output must be refetched for the new language to take effect.
    router.refresh();
    // React Query caches server data client-side independent of the server
    // render tree (e.g. providers mounted above this one, like settings/colors),
    // so those cached responses must be invalidated explicitly or they keep
    // showing content fetched under the previous language until they go stale.
    queryClient.invalidateQueries();
  };

  const effectiveLanguage = language;
  const dir = getDirection(effectiveLanguage);

  // Apply direction to HTML element immediately
  useEffect(() => {
    document.documentElement.lang = effectiveLanguage;
    document.documentElement.dir = dir;
  }, [effectiveLanguage, dir]);

  const t = (key: string): string => {
    // @ts-ignore
    return translations[effectiveLanguage][key] || translateMessage(key, effectiveLanguage);
  };

  return (
    <I18nContext.Provider value={{ language: effectiveLanguage, setLanguage, t, dir }}>
      <DirectionProvider dir={dir}>
        {/*
          Most call sites use `translateMessage(msg)` without a language argument,
          which resolves the language at render time rather than subscribing to
          this context. Keying on the language remounts them on a switch so they
          re-resolve instead of keeping the previous language's text.
        */}
        <React.Fragment key={effectiveLanguage}>{children}</React.Fragment>
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
