'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { authService, type User } from '@/lib/auth-service';
import { fetchUserProfile, profileKeys, updateUserProfile } from '../api/profile-api';
import type { UserProfileValues } from '../schemas/profile.schema';

function hasUserToken() {
  return Boolean(authService.getUserToken());
}

function normalizeCountryCode(countryCode?: string) {
  if (!countryCode) return '';
  return countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
}

export function getUserProfilePhoneValue(user: User | null | undefined) {
  if (!user?.phone) return '';
  if (user.phone.startsWith('+')) return user.phone;

  const countryCode = normalizeCountryCode(user.country_code);
  return countryCode ? `${countryCode}${user.phone}` : user.phone;
}

function splitPhoneValue(phone: string, fallbackCountryCode?: string) {
  const parsed = parsePhoneNumberFromString(phone || '');
  if (parsed) {
    return {
      countryCode: `+${parsed.countryCallingCode}`,
      phoneNumber: parsed.nationalNumber,
    };
  }

  return {
    countryCode: normalizeCountryCode(fallbackCountryCode),
    phoneNumber: phone.replace(/^\+\d{1,4}/, ''),
  };
}

export function useUserProfile() {
  const queryClient = useQueryClient();
  const cachedUser = authService.getUser();

  const profileQuery = useQuery({
    queryKey: profileKeys.detail(),
    queryFn: fetchUserProfile,
    enabled: typeof window !== 'undefined' && hasUserToken(),
    initialData: cachedUser ?? undefined,
    meta: { skipGlobalErrorToast: true },
  });

  const updateMutation = useMutation({
    mutationFn: (values: UserProfileValues) => {
      const phoneParts = splitPhoneValue(values.phone, profileQuery.data?.country_code);

      return updateUserProfile({
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        phone: phoneParts.phoneNumber,
        country_code: phoneParts.countryCode,
      });
    },
    onSuccess: (user) => {
      authService.setUserProfile(user);
      queryClient.setQueryData(profileKeys.detail(), user);
      queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
    },
  });

  return {
    user: profileQuery.data ?? cachedUser ?? null,
    isLoading: profileQuery.isLoading,
    isFetching: profileQuery.isFetching,
    isError: profileQuery.isError,
    errorMessage: profileQuery.error instanceof Error ? profileQuery.error.message : null,
    refetch: profileQuery.refetch,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error instanceof Error ? updateMutation.error.message : null,
    updateSuccess: updateMutation.isSuccess,
  };
}
