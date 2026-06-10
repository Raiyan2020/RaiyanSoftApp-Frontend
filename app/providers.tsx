'use client';
import { I18nProvider } from '@/lib/i18nContext';
import { AuthGuardProvider } from '@/lib/authGuardContext';
import { ToastProvider, ToastInitializer } from '@/lib/toast-context';
import { ConfirmProvider } from '@/lib/confirm-dialog';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { ThemeProvider } from '@/lib/themeContext';
import { UserColorsProvider } from '@/features/colors';
import { UserSettingsProvider } from '@/features/settings';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <ToastInitializer />
          <ConfirmProvider>
            <UserSettingsProvider>
              <UserColorsProvider>
                <I18nProvider>
                  <AuthGuardProvider>{children}</AuthGuardProvider>
                </I18nProvider>
              </UserColorsProvider>
            </UserSettingsProvider>
          </ConfirmProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

