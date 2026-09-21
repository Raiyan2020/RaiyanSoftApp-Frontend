'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from '@/lib/i18nContext';
import { queryClient } from '@/lib/query-client';
import { UserSettingsProvider } from '@/features/settings';

export default function LandingProviders({
  children,
  initialLanguage,
}: {
  children: React.ReactNode;
  initialLanguage?: 'en' | 'ar';
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider initialLanguage={initialLanguage}>
        <UserSettingsProvider>{children}</UserSettingsProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
