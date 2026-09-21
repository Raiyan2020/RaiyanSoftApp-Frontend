'use client';

import Navbar from '@/components/landing/Navbar';
import HeroBanner from '@/components/landing/HeroBanner';
import type { LandingPageContent } from '@/features/landing-page';
import { useLanding } from './use-landing';
import { useTranslation } from '@/lib/i18nContext';

export default function LandingShell({ homeData }: { homeData?: LandingPageContent | null }) {
  const { dark, toggleDark } = useLanding();
  const { t } = useTranslation();

  return (
    <>
      <a href="#main-content" className="skip-link">{t('Skip to content')}</a>
      <div className="scroll-progress" aria-hidden="true" />
      <Navbar dark={dark} onToggleDark={toggleDark} />
      <HeroBanner homeData={homeData} />
    </>
  );
}
