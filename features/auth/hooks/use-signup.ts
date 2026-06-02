import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api-service';
import { authService } from '@/lib/auth-service';
import { useTranslation } from '@/lib/i18nContext';
import { SignupValues } from '../schemas/signup.schema';

export function useSignup() {
  const router = useRouter();
  const { t } = useTranslation();
  const [error, setError] = useState<{ code?: string; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const signup = async (data: SignupValues) => {
    setError(null);
    setLoading(true);

    try {
      let countryCode = '+966';
      let phoneNumber = data.phone || '';
      if (phoneNumber.startsWith('+')) {
        const match = phoneNumber.match(/^(\+\d{1,3})(\d+)$/);
        if (match) {
          countryCode = match[1];
          phoneNumber = match[2];
        }
      }

      const response = await apiService.post('user/auth/register', {
        first_name: data.firstName,
        last_name: data.lastName,
        country_code: countryCode,
        phone: phoneNumber,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
        device_id: 'device_abc123',
        device_type: 'web',
      });

      if (!response.status) {
        let msg = response.message || 'Signup failed.';
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

      router.push('/home');
    } catch (err: any) {
      console.error("Signup Error:", err);
      setError({ message: err.message || 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    signup,
  };
}

