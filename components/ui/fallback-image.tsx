'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { translateMessage } from '@/lib/i18n-utils';

/** Site logo shown whenever an image is missing or fails to load. */
export const DEFAULT_IMAGE_FALLBACK = '/logo.webp';

export interface FallbackImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  /** Image used when `src` is empty or fails. Defaults to the site logo. */
  fallbackSrc?: string;
  /** Extra classes applied only while the fallback is shown. */
  fallbackClassName?: string;
}

function normalizeSrc(src: unknown): string | null {
  if (typeof src !== 'string') return null;
  const trimmed = src.trim();
  return trimmed ? trimmed : null;
}

/**
 * Plain `<img>` that swaps to the site logo when `src` is missing/empty or fails to load.
 * The swap happens once per `src` (no error loop) and resets automatically when `src` changes.
 * In fallback mode the logo is contained with padding on a neutral surface so it is never cropped.
 */
export default function FallbackImage({
  src,
  alt,
  className,
  fallbackSrc = DEFAULT_IMAGE_FALLBACK,
  fallbackClassName,
  loading = 'lazy',
  decoding = 'async',
  onError,
  ...props
}: FallbackImageProps) {
  const resolvedSrc = normalizeSrc(src);
  // Remember which src failed; a new src automatically clears the fallback state.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showFallback = !resolvedSrc || failedSrc === resolvedSrc;
  const finalSrc = showFallback ? normalizeSrc(fallbackSrc) || DEFAULT_IMAGE_FALLBACK : resolvedSrc;

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Only swap from the real image; if the fallback itself fails, stop (no loop).
    if (!showFallback && resolvedSrc) setFailedSrc(resolvedSrc);
    onError?.(event);
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element -- images are unoptimized; plain <img> is intentional
    <img
      {...props}
      src={finalSrc}
      alt={alt ?? translateMessage('Image')}
      loading={loading}
      decoding={decoding}
      onError={handleError}
      data-fallback={showFallback ? 'true' : undefined}
      className={cn(
        'object-cover',
        className,
        showFallback && 'bg-[var(--surface-2)] object-contain p-[12%]',
        showFallback && fallbackClassName
      )}
    />
  );
}
