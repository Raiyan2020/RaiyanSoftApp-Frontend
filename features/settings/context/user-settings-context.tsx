'use client';

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { UserSettings } from '../types/user-settings.types';
import { useUserSettingsQuery } from '../hooks/use-user-settings';

interface UserSettingsContextValue {
  settings: UserSettings | null;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  refetch: () => Promise<unknown>;
}

const UserSettingsContext = createContext<UserSettingsContextValue | undefined>(undefined);

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const query = useUserSettingsQuery();

  const value = useMemo<UserSettingsContextValue>(
    () => ({
      settings: query.data ?? null,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      error: query.error ? (query.error as Error).message : null,
      refetch: query.refetch,
    }),
    [query.data, query.isLoading, query.isFetching, query.error, query.refetch]
  );

  return <UserSettingsContext.Provider value={value}>{children}</UserSettingsContext.Provider>;
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext);

  if (!context) {
    throw new Error('useUserSettings must be used within UserSettingsProvider');
  }

  return context;
}
