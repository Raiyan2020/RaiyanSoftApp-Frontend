'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { translateMessage } from '@/lib/i18n-utils';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const FALLBACK_URL = '/logo.webp';

const isValidImageUrl = (url: any): boolean => {
  if (!url || typeof url !== 'string') return false;
  try {
    if (url.startsWith('/')) return true;
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function SafeImage({
  src,
  alt,
  className,
  fallbackSrc = FALLBACK_URL,
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  // Reset the error flag during render when `src` changes, instead of in an
  // effect, so a failing image doesn't briefly show the fallback for one
  // extra render pass after a new `src` is passed in.
  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
  }

  const handleError = () => {
    setHasError(true);
  };

  const initialSrc = hasError ? fallbackSrc : src;
  const finalSrc = (isValidImageUrl(initialSrc)
    ? initialSrc
    : (isValidImageUrl(fallbackSrc) ? fallbackSrc : FALLBACK_URL)) as string;

  return (
    <div className={`relative ${className || ''}`} style={{ overflow: 'hidden' }}>
      <Image
        src={finalSrc}
        alt={alt || translateMessage('Image')}
        fill
        className="object-cover"
        onError={handleError}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
