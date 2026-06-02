'use client';
import { I18nProvider } from '@/lib/i18nContext';
import { AuthGuardProvider } from '@/lib/authGuardContext';
import { ToastProvider, ToastInitializer } from '@/lib/toast-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { ThemeProvider } from '@/lib/themeContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <ToastInitializer />
          <I18nProvider>
            <AuthGuardProvider>
              {children}
            </AuthGuardProvider>
          </I18nProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}


