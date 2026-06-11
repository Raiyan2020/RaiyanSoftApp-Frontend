import type { Metadata } from 'next';
import { createPublicMetadata } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'الملف الشخصي',
  description: 'منطقة الملف الشخصي — غير مخصصة للفهرسة العامة.',
  path: '/profile',
  noIndex: true,
});

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
