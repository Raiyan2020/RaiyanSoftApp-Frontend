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

/**
 * Intl locale for the app language. Arabic keeps Latin digits so formatted
 * dates match the counts, prices, and phone numbers rendered elsewhere.
 */
export function getIntlLocale(language: AppLanguage): string {
  return language === 'ar' ? 'ar-KW-u-nu-latn' : 'en-GB';
}

/**
 * Formats a date for display in the current language. Accepts timestamps,
 * ISO strings, backend `Y-m-d H:i:s` strings and `j M Y` strings; returns the
 * raw value unchanged when it cannot be parsed.
 */
export function formatLocalizedDate(
  value: string | number | Date | null | undefined,
  language: AppLanguage,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' },
): string {
  if (value === null || value === undefined || value === '') return '';
  const date =
    typeof value === 'string'
      ? new Date(/^\d{4}-\d{2}-\d{2} \d/.test(value) ? value.replace(' ', 'T') : value)
      : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat(getIntlLocale(language), options).format(date);
}
