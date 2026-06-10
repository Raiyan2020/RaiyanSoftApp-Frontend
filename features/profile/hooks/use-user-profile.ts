'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, type User } from '@/lib/auth-service';
import { fetchUserProfile, updateUserProfile } from '../services/profile-api';
import { profileKeys } from '../query-keys';
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
      return updateUserProfile({
        full_name: [values.firstName, values.lastName].filter(Boolean).join(' '),
        email: values.email,
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
