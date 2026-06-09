'use client';

import { useCallback, useState } from 'react';
import { updateAdminPage } from '../api/admin-pages-api';
import { AboutUsForm, PageSlug, SimplePageForm } from '../types/page.types';

export function useUpdatePage(slug: PageSlug) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const save = useCallback(
    async (payload: SimplePageForm | AboutUsForm) => {
      setLoading(true);
      setError(null);
      setMessage(null);

      try {
        await updateAdminPage(slug, payload);
        setMessage('Page saved successfully.');
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to save page.';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [slug]
  );

  const clearFeedback = useCallback(() => {
    setError(null);
    setMessage(null);
  }, []);

  return { save, loading, error, message, clearFeedback };
}
