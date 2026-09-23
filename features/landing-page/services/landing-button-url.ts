import { getSiteUrl } from '@/lib/site';

/** Empty, hash anchors, relative paths, and absolute http(s) URLs are accepted in the admin UI. */
export function isValidLandingButtonUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith('#') || trimmed.startsWith('/')) return true;
  return /^https?:\/\/.+/i.test(trimmed);
}

/** Converts admin-friendly URLs (e.g. `#contact`) to absolute http(s) URLs for the API. */
export function normalizeLandingButtonUrlForApi(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const siteUrl = getSiteUrl();

  if (trimmed.startsWith('#')) {
    return `${siteUrl}${trimmed}`;
  }

  if (trimmed.startsWith('/')) {
    return `${siteUrl}${trimmed}`;
  }

  return trimmed;
}

/** Shows hash/relative URLs in the admin form when the API stored an absolute same-site URL. */
export function formatLandingButtonUrlForForm(url: string | null | undefined): string {
  if (!url) return '';

  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('#')) return trimmed;

  try {
    const siteOrigin = new URL(getSiteUrl()).origin;
    const parsed = new URL(trimmed);

    if (parsed.origin === siteOrigin) {
      if (parsed.hash) return parsed.hash;
      const path = `${parsed.pathname}${parsed.search}`;
      if (path && path !== '/') return path;
    }
  } catch {
    // Keep the raw value when it cannot be parsed.
  }

  return trimmed;
}

export type LandingButtonAction =
  | { type: 'fallback' }
  | { type: 'scroll'; target: string }
  | { type: 'internal'; href: string }
  | { type: 'external'; href: string };

/**
 * Decides what a public landing button does with its admin-set URL. Empty, `#`,
 * or a bare link to the home page means "no explicit link" → the caller's
 * default action. Same-site links stay in-app; other http(s) links open a tab.
 */
export function resolveLandingButtonAction(url: string | null | undefined): LandingButtonAction {
  const trimmed = url?.trim();
  if (!trimmed || trimmed === '#') return { type: 'fallback' };
  if (trimmed.startsWith('#')) return { type: 'scroll', target: trimmed };

  const siteOrigins = [new URL(getSiteUrl()).origin];
  if (typeof window !== 'undefined') siteOrigins.push(window.location.origin);

  let parsed: URL;
  try {
    parsed = new URL(trimmed, siteOrigins[siteOrigins.length - 1]);
  } catch {
    return { type: 'fallback' };
  }
  if (!/^https?:$/i.test(parsed.protocol)) return { type: 'fallback' };
  if (!siteOrigins.includes(parsed.origin)) return { type: 'external', href: parsed.href };

  const path = `${parsed.pathname}${parsed.search}`;
  if (path === '/') {
    return parsed.hash.length > 1 ? { type: 'scroll', target: parsed.hash } : { type: 'fallback' };
  }
  return { type: 'internal', href: `${path}${parsed.hash}` };
}

/** Runs a landing button: explicit backend link if set, otherwise `onFallback`. */
export function runLandingButtonAction(
  url: string | null | undefined,
  { onFallback, navigate }: { onFallback: () => void; navigate: (href: string) => void }
): void {
  const action = resolveLandingButtonAction(url);
  if (action.type === 'external') {
    window.open(action.href, '_blank', 'noopener,noreferrer');
  } else if (action.type === 'internal') {
    navigate(action.href);
  } else if (action.type === 'scroll') {
    let el: Element | null = null;
    try {
      el = document.querySelector(action.target);
    } catch {
      // Malformed selector from admin input: treat as no link.
    }
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else onFallback();
  } else {
    onFallback();
  }
}
