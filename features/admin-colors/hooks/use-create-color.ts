'use client';

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { userColorsKeys } from '@/features/colors/api/user-colors-api';
import { createAdminColor } from '../api/admin-colors-api';
import { CreateColorPayload } from '../types/admin-color.types';

export function useCreateColor() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createColor = useCallback(
    async (payload: CreateColorPayload) => {
      setLoading(true);
      setError(null);

      try {
        const color = await createAdminColor(payload);
        await queryClient.invalidateQueries({ queryKey: userColorsKeys.all });
        return color;
      } catch (err: any) {
        const message = err.message || 'Failed to create color.';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [queryClient]
  );

  return { createColor, loading, error };
}
