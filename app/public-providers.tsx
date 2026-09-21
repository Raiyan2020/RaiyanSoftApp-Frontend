'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from '@/lib/i18nContext';
import { queryClient } from '@/lib/query-client';

export default function PublicProviders({
  children,
  initialLanguage,
}: {
  children: React.ReactNode;
  initialLanguage?: 'en' | 'ar';
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider initialLanguage={initialLanguage}>{children}</I18nProvider>
    </QueryClientProvider>
  );
}
