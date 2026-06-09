'use client';

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { UserColor } from '../types/user-colors.types';
import { useUserColorsQuery } from '../hooks/use-user-colors';

interface UserColorsContextValue {
  colors: UserColor[];
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  refetch: () => Promise<unknown>;
}

const UserColorsContext = createContext<UserColorsContextValue | undefined>(undefined);

export function UserColorsProvider({ children }: { children: ReactNode }) {
  const query = useUserColorsQuery();

  const value = useMemo<UserColorsContextValue>(
    () => ({
      colors: query.data ?? [],
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      error: query.error ? (query.error as Error).message : null,
      refetch: query.refetch,
    }),
    [query.data, query.isLoading, query.isFetching, query.error, query.refetch]
  );

  return <UserColorsContext.Provider value={value}>{children}</UserColorsContext.Provider>;
}

export function useUserColors() {
  const context = useContext(UserColorsContext);

  if (!context) {
    throw new Error('useUserColors must be used within UserColorsProvider');
  }

  return context;
}
