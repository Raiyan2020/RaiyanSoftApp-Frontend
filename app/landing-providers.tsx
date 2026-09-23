'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from '@/lib/i18nContext';
import { queryClient } from '@/lib/query-client';
import { ToastProvider } from '@/lib/toast-context';
import { UserColorsProvider } from '@/features/colors';
import { UserSettingsProvider } from '@/features/settings';

// Public/landing tree. Navbar's quick lead dialog (LeadProjectWizard) needs
// UserColorsProvider; its errors/successes go through globalToast, which
// needs the Toaster that ToastProvider mounts.
export default function LandingProviders({
  children,
  initialLanguage,
}: {
  children: React.ReactNode;
  initialLanguage?: 'en' | 'ar';
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <I18nProvider initialLanguage={initialLanguage}>
          <UserSettingsProvider>
            <UserColorsProvider>{children}</UserColorsProvider>
          </UserSettingsProvider>
        </I18nProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
