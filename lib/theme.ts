export type AppTheme = 'light' | 'dark';

export const DEFAULT_THEME: AppTheme = 'dark';

/** Local storage key shared by every theme toggle across the app. */
export const THEME_STORAGE_KEY = 'theme';

function normalizeTheme(value: string | null | undefined): AppTheme | null {
  return value === 'light' || value === 'dark' ? value : null;
}

/**
 * Reads the persisted theme preference on the client. Returns `null` when
 * nothing is stored (or storage is unavailable) so callers can decide what to
 * default to.
 */
export function readStoredTheme(): AppTheme | null {
  if (typeof window === 'undefined') return null;

  try {
    return normalizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    // Private mode / disabled storage.
    return null;
  }
}

/** Persists the theme preference. Silently no-ops when storage is unavailable. */
export function persistTheme(theme: AppTheme): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors (e.g. private mode).
  }
}
