import { cookies } from 'next/headers';
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, normalizeLanguage, type AppLanguage } from './language';

/**
 * Resolves the request language from the cookie written by the client switcher.
 * Server components have no access to localStorage, so the cookie is the only
 * way rendered content can follow the selected language.
 */
export async function getServerLanguage(): Promise<AppLanguage> {
  try {
    const store = await cookies();
    return normalizeLanguage(store.get(LANGUAGE_COOKIE)?.value);
  } catch {
    return DEFAULT_LANGUAGE;
  }
}
