import type { Metadata } from 'next';
import { createPublicMetadata } from '@/lib/site';
import { getServerLanguage } from '@/lib/language.server';

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();

  return createPublicMetadata({
    title: language === 'ar' ? 'الملف الشخصي' : 'Profile',
    description:
      language === 'ar'
        ? 'منطقة الملف الشخصي — غير مخصصة للفهرسة العامة.'
        : 'Profile area — not intended for public indexing.',
    path: '/profile',
    noIndex: true,
  });
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
