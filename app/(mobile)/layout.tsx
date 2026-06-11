import type { Metadata } from 'next';
import { createPublicMetadata } from '@/lib/site';
import MobileLayoutClient from './mobile-layout-client';

export const metadata: Metadata = createPublicMetadata({
  title: 'تطبيق العملاء',
  description: 'منطقة العملاء والتطبيق — غير مخصصة للفهرسة العامة.',
  path: '/home',
  noIndex: true,
});

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return <MobileLayoutClient>{children}</MobileLayoutClient>;
}
