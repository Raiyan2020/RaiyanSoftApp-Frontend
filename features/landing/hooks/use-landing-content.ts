'use client';

import { useMemo } from 'react';
import { useTranslation } from '@/lib/i18nContext';
import { useUserSettings } from '@/features/settings';
import { landingContent, type LandingLanguage } from '../data/landing-content';

export function useLandingContent() {
  const { language, dir } = useTranslation();
  const { settings } = useUserSettings();

  const lang = (language === 'en' ? 'en' : 'ar') as LandingLanguage;
  const content = landingContent[lang];

  const siteName = settings?.site_name || (lang === 'ar' ? 'ريان سوفت' : 'Raiyansoft');
  const siteDescription = settings?.site_description || content.footer.description;

  const contactMethods = useMemo(
    () => [
      {
        label: content.contact.methods.emailLabel,
        value: settings?.site_email || 'info@raiyansoft.com',
        hint: content.contact.methods.emailHint,
        dir: 'ltr' as const,
      },
      {
        label: content.contact.methods.phoneLabel,
        value: settings?.site_phone || '',
        hint: content.contact.methods.phoneHint,
        dir: 'ltr' as const,
      },
      {
        label: content.contact.methods.locationLabel,
        value: settings?.site_address || (lang === 'ar' ? 'الكويت' : 'Kuwait'),
        hint: content.contact.methods.locationHint,
        dir: dir,
      },
    ].filter((method) => method.value),
    [content.contact.methods, dir, lang, settings]
  );

  const textAlign = dir === 'rtl' ? 'text-center lg:text-right' : 'text-center lg:text-left';
  const flexAlign = dir === 'rtl' ? 'lg:justify-start' : 'lg:justify-start';

  return {
    lang,
    dir,
    content,
    siteName,
    siteDescription,
    contactMethods,
    textAlign,
    flexAlign,
    socialMedia: settings?.social_media,
  };
}
