'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { apiService } from '@/lib/api-service';
import { authService, User } from '@/lib/auth-service';
import { guestStore } from '@/lib/guestStore';

export type PhoneAuthStep = 'phone' | 'otp';

interface PhoneParts {
  countryCode: string;
  phone: string;
}

export interface PhoneVerifyResponse {
  token: string;
  access_token?: string;
  user: User;
}

export interface PhoneAuthSubmitValues {
  phone: string;
  otp: string;
  name?: string;
}

function getApiMessage(response: { message?: string; errors?: unknown }, fallback: string) {
  if (response?.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) {
      return errList.join(' ');
    }
  }

  return response?.message || fallback;
}

function splitPhoneNumber(phoneNumber: string): PhoneParts {
  const parsed = parsePhoneNumberFromString(phoneNumber);

  if (parsed) {
    return {
      countryCode: `+${parsed.countryCallingCode}`,
      phone: parsed.nationalNumber,
    };
  }

  const match = phoneNumber.replace(/\s/g, '').match(/^(\+\d{2,5})(\d{8,15})$/);
  return {
    countryCode: match?.[1] ?? '+20',
    phone: match?.[2] ?? phoneNumber.replace(/\D/g, ''),
  };
}

function createFormData(values: Record<string, string | undefined>) {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value);
  });

  return formData;
}

function createOneTimePassword(phoneNumber: string) {
  return `Otp-${phoneNumber.replace(/\D/g, '').slice(-6)}-${Date.now()}Aa!`;
}

interface UsePhoneAuthOptions {
  onSuccess?: () => void | Promise<void>;
}

export function usePhoneAuth(options?: UsePhoneAuthOptions) {
  const router = useRouter();
  const [step, setStep] = useState<PhoneAuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [phoneParts, setPhoneParts] = useState<PhoneParts | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [newUserOtpSent, setNewUserOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStep('phone');
    setPhone('');
    setPhoneParts(null);
    setIsNewUser(null);
    setNewUserOtpSent(false);
    setLoading(false);
    setError(null);
    setMessage(null);
  }, []);

  const sendLoginOtp = async (parts: PhoneParts) => {
    const response = await apiService.post<[] | Record<string, unknown>>(
      'user/auth/login',
      createFormData({
        country_code: parts.countryCode,
        phone: parts.phone,
      }),
      { skipGlobalToast: true }
    );

    if (!response.status) {
      throw new Error(getApiMessage(response, 'Unable to send the verification code.'));
    }

    return response;
  };

  const checkPhone = async (phoneNumber: string) => {
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const parts = splitPhoneNumber(phoneNumber);
      const response = await apiService.post<[] | Record<string, unknown>>(
        'user/auth/check-phone-found',
        createFormData({
          country_code: parts.countryCode,
          phone: parts.phone,
        }),
        { skipGlobalToast: true }
      );

      setPhone(phoneNumber);
      setPhoneParts(parts);

      if (response.status) {
        setIsNewUser(true);
        setNewUserOtpSent(false);
        setStep('otp');
        setMessage(response.message || null);
        return;
      }

      const loginResponse = await sendLoginOtp(parts);
      setPhone(phoneNumber);
      setPhoneParts(parts);
      setIsNewUser(false);
      setNewUserOtpSent(true);
      setStep('otp');
      setMessage(loginResponse.message || 'OTP sent successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to verify this phone number.');
    } finally {
      setLoading(false);
    }
  };

  const submitRegistrationDetails = async (name: string) => {
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (!phoneParts) {
        throw new Error('Please enter your phone number again.');
      }

      const password = createOneTimePassword(phone);
      const response = await apiService.post<[] | Record<string, unknown>>(
        'user/auth/register',
        createFormData({
          full_name: name,
          country_code: phoneParts.countryCode,
          phone: phoneParts.phone,
          password,
          password_confirmation: password,
        }),
        { skipGlobalToast: true }
      );

      if (!response.status) {
        throw new Error(getApiMessage(response, 'Unable to create this account.'));
      }

      setIsNewUser(true);
      setNewUserOtpSent(true);
      setStep('otp');
      setMessage(response.message || 'OTP sent successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create this account.');
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async ({ otp }: PhoneAuthSubmitValues) => {
    setError(null);
    setLoading(true);

    try {
      if (!phoneParts) {
        throw new Error('Please enter your phone number again.');
      }

      const response = await apiService.post<PhoneVerifyResponse>(
        'user/auth/verify-otp',
        createFormData({
          country_code: phoneParts.countryCode,
          phone: phoneParts.phone,
          otp,
          device_id: 'device_abc123',
          device_type: 'web',
        }),
        { skipGlobalToast: true }
      );

      if (!response.status) {
        throw new Error(getApiMessage(response, 'Invalid verification code.'));
      }

      const token = response.data?.token || response.data?.access_token;
      const user = response.data?.user;

      if (!user || !token) {
        throw new Error('Login response must include user and token.');
      }

      guestStore.setGuest(false);
      authService.setUserSession(user, token);

      if (options?.onSuccess) {
        await options.onSuccess();
        return;
      }

      const intendedPath = guestStore.intendedPath;
      guestStore.setIntendedPath(null);
      router.push(intendedPath || '/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    phone,
    isNewUser,
    newUserOtpSent,
    loading,
    error,
    message,
    reset,
    checkPhone,
    submitRegistrationDetails,
    submitOtp,
  };
}
