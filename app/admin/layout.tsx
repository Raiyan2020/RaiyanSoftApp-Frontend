import type { Metadata } from 'next';
import { createPublicMetadata } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'لوحة الإدارة',
  description: 'لوحة إدارة ريان سوفت — غير مخصصة للفهرسة العامة.',
  path: '/admin',
  noIndex: true,
});

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
