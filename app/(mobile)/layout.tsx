import type { Metadata } from 'next';
import { createPublicMetadata } from '@/lib/site';
import { getServerLanguage } from '@/lib/language.server';
import MobileLayoutClient from './mobile-layout-client';

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();

  return createPublicMetadata({
    title: language === 'ar' ? 'تطبيق العملاء' : 'Client App',
    description:
      language === 'ar'
        ? 'منطقة العملاء والتطبيق — غير مخصصة للفهرسة العامة.'
        : 'Client and app area — not intended for public indexing.',
    path: '/home',
    noIndex: true,
  });
}

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return <MobileLayoutClient>{children}</MobileLayoutClient>;
}
