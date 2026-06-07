'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api-service';
import { authService, User } from '@/lib/auth-service';
import { guestStore } from '@/lib/guestStore';

export type PhoneAuthStep = 'phone' | 'otp';

export interface PhoneCheckResponse {
  is_new_user: boolean;
  otp_sent: boolean;
  expires_in_seconds?: number;
}

export interface PhoneVerifyResponse {
  token: string;
  user: User;
}

export interface PhoneAuthSubmitValues {
  phone: string;
  otp: string;
  name?: string;
}

function getApiMessage(response: any, fallback: string) {
  if (response?.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) {
      return errList.join(' ');
    }
  }

  return response?.message || fallback;
}

interface UsePhoneAuthOptions {
  onSuccess?: () => void;
}

export function usePhoneAuth(options?: UsePhoneAuthOptions) {
  const router = useRouter();
  const [step, setStep] = useState<PhoneAuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStep('phone');
    setPhone('');
    setIsNewUser(null);
    setLoading(false);
    setError(null);
    setMessage(null);
  }, []);

  const checkPhone = async (phoneNumber: string) => {
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const response = await apiService.post<PhoneCheckResponse>(
        'user/auth/phone/check',
        {
          phone: phoneNumber,
          device_id: 'device_abc123',
          device_type: 'web',
        },
        { skipGlobalToast: true }
      );

      if (!response.status) {
        throw new Error(getApiMessage(response, 'Unable to verify this phone number.'));
      }

      setPhone(phoneNumber);
      setIsNewUser(Boolean(response.data?.is_new_user));
      setStep('otp');
      setMessage(response.message || 'OTP sent successfully.');
    } catch (err: any) {
      setError(err.message || 'Unable to verify this phone number.');
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async ({ phone: phoneNumber, otp, name }: PhoneAuthSubmitValues) => {
    setError(null);
    setLoading(true);

    try {
      const response = await apiService.post<PhoneVerifyResponse>(
        'user/auth/phone/verify',
        {
          phone: phoneNumber,
          otp,
          name: isNewUser ? name : undefined,
          device_id: 'device_abc123',
          device_type: 'web',
        },
        { skipGlobalToast: true }
      );

      if (!response.status) {
        throw new Error(getApiMessage(response, 'Invalid verification code.'));
      }

      if (!response.data?.user || !response.data?.token) {
        throw new Error('Login response must include user and token.');
      }

      guestStore.setGuest(false);
      authService.setUserSession(response.data.user, response.data.token);

      if (options?.onSuccess) {
        options.onSuccess();
        return;
      }

      const intendedPath = guestStore.intendedPath;
      guestStore.setIntendedPath(null);
      router.push(intendedPath || '/home');
    } catch (err: any) {
      setError(err.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    phone,
    isNewUser,
    loading,
    error,
    message,
    reset,
    checkPhone,
    submitOtp,
  };
}
