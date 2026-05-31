'use client';

import Link from 'next/link';
import type { LinkProps } from 'next/link';
import type { AnchorHTMLAttributes } from 'react';
import { trackPublicEvent } from '@/lib/analytics';

type TrackedLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    eventName: string;
    eventPayload?: Record<string, string | number | boolean | undefined>;
  };

export default function TrackedLink({ eventName, eventPayload, onClick, ...props }: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackPublicEvent(eventName, eventPayload);
        onClick?.(event);
      }}
    />
  );
}

