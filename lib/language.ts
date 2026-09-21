export type AppLanguage = 'en' | 'ar';

export const DEFAULT_LANGUAGE: AppLanguage = 'ar';

/** Mirrored in a cookie so the server and API layer can read the same preference. */
export const LANGUAGE_COOKIE = 'rs_lang';
export const LANGUAGE_STORAGE_KEY = 'rs_lang';

/** One year, in seconds. */
const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function normalizeLanguage(value: string | null | undefined): AppLanguage {
  return value === 'en' || value === 'ar' ? value : DEFAULT_LANGUAGE;
}

export function getDirection(language: AppLanguage): 'ltr' | 'rtl' {
  return language === 'ar' ? 'rtl' : 'ltr';
}

/** Persists to both localStorage and a cookie so client, server, and API stay in sync. */
export function persistLanguage(language: AppLanguage): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Ignore storage errors (e.g. private mode).
  }

  document.cookie = `${LANGUAGE_COOKIE}=${language};path=/;max-age=${LANGUAGE_COOKIE_MAX_AGE};samesite=lax`;
}

function readLanguageCookie(): AppLanguage | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${LANGUAGE_COOKIE}=([^;]*)`));
  return match ? normalizeLanguage(match[1]) : null;
}

/**
 * Reads the persisted preference on the client. Prefers localStorage, then the
 * cookie, so an existing localStorage-only preference is not lost.
 */
export function readStoredLanguage(): AppLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'en' || stored === 'ar') return stored;
  } catch {
    // Fall through to the cookie.
  }

  return readLanguageCookie() ?? DEFAULT_LANGUAGE;
}
