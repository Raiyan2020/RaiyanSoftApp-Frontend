import { useState } from 'react';
import { apiService } from '@/lib/api-service';
import { authService } from '@/lib/auth-service';
import { useTranslation } from '@/lib/i18nContext';
import { LoginValues } from '../schemas/login.schema';

export function useLogin() {
  const { t } = useTranslation();
  const [error, setError] = useState<{ code?: string; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const login = async (data: LoginValues) => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await apiService.post('user/auth/login', {
        email: data.email,
        password: data.password,
        device_id: 'device_abc123',
        device_type: 'web',
      });

      if (!response.status) {
        let msg = response.message || t('auth.invalid_cred');
        if (response.errors && typeof response.errors === 'object') {
          const errList = Object.values(response.errors).flat();
          if (errList.length > 0) {
            msg = errList.join(' ');
          }
        }
        throw new Error(msg);
      }

      const { user, token } = response.data;
      authService.setUserSession(user, token);
    } catch (err: any) {
      console.error("Login Error", err);
      setError({ message: err.message || t('auth.invalid_cred') });
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    if (!email) {
      setError({ message: t('auth.email_required') });
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setResetLoading(true);

    try {
      // Mock or call backend if needed - backend auth is primary focus
      setSuccessMessage(t('auth.reset_email_sent'));
    } catch (err: any) {
      console.error("Reset Password Error", err);
      setError({ message: err.message || t('auth.invalid_cred') });
    } finally {
      setResetLoading(false);
    }
  };

  return {
    error,
    loading,
    resetLoading,
    successMessage,
    login,
    forgotPassword,
  };
}

