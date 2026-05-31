'use client';

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    fbq?: any;
  }
}

export function trackPublicEvent(name: string, payload: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new CustomEvent('public-analytics-event', { detail: { name, payload } }));

  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', name, payload);
  }
}
