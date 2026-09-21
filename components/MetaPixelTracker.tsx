'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function MetaPixelTracker() {
  const pathname = usePathname();
  const initialPathname = useRef(pathname);

  useEffect(() => {
    if (!pathname || pathname === initialPathname.current) return;

    const trackPageView = () => {
      if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'PageView');
      }
    };

    const idleCallback = (window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    }).requestIdleCallback;

    if (idleCallback) {
      const idleId = idleCallback(trackPageView, { timeout: 2000 });
      return () => window.cancelIdleCallback?.(idleId);
    }

    const timeoutId = globalThis.setTimeout(trackPageView, 1000);
    return () => globalThis.clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
