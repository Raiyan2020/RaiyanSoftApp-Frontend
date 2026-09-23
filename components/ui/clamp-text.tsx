'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/lib/i18nContext';
import { translateMessage } from '@/lib/i18n-utils';

// Literal class names so Tailwind's JIT sees them.
const CLAMP = { 2: 'line-clamp-2', 3: 'line-clamp-3', 4: 'line-clamp-4' } as const;

type ClampTextProps = {
  children: React.ReactNode;
  lines?: keyof typeof CLAMP;
  className?: string;
  /** Override the toggle colour on dark cards. */
  toggleClassName?: string;
};

/**
 * Clamps card copy to a fixed number of lines and offers a per-card
 * "Show more / Show less" toggle — rendered only when the text actually
 * overflows. Do not use inside a link/card that is itself a link.
 */
export default function ClampText({ children, lines = 3, className = '', toggleClassName = 'text-primary hover:text-primary-dark' }: ClampTextProps) {
  const { language } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || expanded) return;
    // Half a line of slack: Arabic glyphs overhang the line box by a few px,
    // which would otherwise flag 2-line text as "overflowing" a 3-line clamp.
    const measure = () => {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 24;
      setOverflows(el.scrollHeight - el.clientHeight > lineHeight / 2);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded, children]);

  return (
    <div>
      <div ref={ref} className={`${expanded ? '' : CLAMP[lines]} ${className}`}>
        {children}
      </div>
      {overflows ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
          className={`mt-2 text-sm font-bold underline-offset-4 transition hover:underline ${toggleClassName}`}
        >
          {translateMessage(expanded ? 'Show less' : 'Show more', language)}
        </button>
      ) : null}
    </div>
  );
}
