'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import LandingProviders from './landing-providers';

const FullProviders = dynamic(() => import('./providers'), { ssr: false });

const publicPrefixes = [
  '/about',
  '/blogs',
  '/careers',
  '/consultation',
  '/contact',
  '/faq',
  '/pages',
  '/partners',
  '/portfolio',
  '/pricing',
  '/privacy',
  '/quote',
  '/services',
  '/team',
  '/terms',
  '/testimonials',
];

function isPublicPath(pathname: string | null) {
  if (!pathname || pathname === '/') return true;
  return publicPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export default function AppProviders({
  children,
  initialLanguage,
}: {
  children: React.ReactNode;
  initialLanguage?: 'en' | 'ar';
}) {
  const pathname = usePathname();

  // Public pages share the home footer, which needs UserSettingsProvider.
  if (isPublicPath(pathname)) {
    return <LandingProviders initialLanguage={initialLanguage}>{children}</LandingProviders>;
  }

  return <FullProviders initialLanguage={initialLanguage}>{children}</FullProviders>;
}
