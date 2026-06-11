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

/** Resolves a stored URL to a scroll target (`#section`) for in-page navigation. */
export function getLandingButtonScrollTarget(
  url: string | null | undefined,
  fallback: string
): string {
  if (!url) return fallback;

  const trimmed = url.trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith('#')) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (parsed.hash) return parsed.hash;
  } catch {
    // Fall through to the raw value.
  }

  return trimmed;
}

/** Opens external or non-hash absolute URLs in a new tab; scroll targets stay on-page. */
export function shouldOpenLandingButtonInNewTab(url: string | null | undefined): boolean {
  if (!url) return false;

  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('/')) return false;

  try {
    const parsed = new URL(trimmed);
    if (parsed.hash) return false;
    return /^https?:$/i.test(parsed.protocol);
  } catch {
    return false;
  }
}
