import type { Metadata } from 'next';
import { Compass } from 'lucide-react';
import AppStateScreen from '@/components/layout/app-state-screen';
import { translations } from '@/lib/translations';
import { createPublicMetadata } from '@/lib/site';
import { getServerLanguage } from '@/lib/language.server';

export async function generateMetadata(): Promise<Metadata> {
  const t = translations[await getServerLanguage()];
  return createPublicMetadata({
    title: t['seo.not_found_title'],
    description: t['seo.not_found_description'],
    path: '/404',
    noIndex: true,
  });
}

export default async function NotFound() {
  const t = translations[await getServerLanguage()];
  return (
    <AppStateScreen
      eyebrow="404"
      title={t['seo.not_found_title']}
      description={t['seo.not_found_description']}
      icon={<Compass size={30} />}
      primaryAction={{ href: '/', label: t['seo.not_found_home'] }}
      backLabel={t['seo.not_found_back']}
    />
  );
}
