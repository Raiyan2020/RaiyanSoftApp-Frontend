import type { Metadata } from 'next';
import { createPublicMetadata } from '@/lib/site';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  return createPublicMetadata({
    language,
    title: translateMessage('Admin Dashboard', language),
    description: translateMessage('Raiyan Soft admin dashboard - not intended for public indexing.', language),
    path: '/admin',
    noIndex: true,
  });
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
