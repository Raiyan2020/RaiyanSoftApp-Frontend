'use client';

import { useCallback, useEffect, useState } from 'react';
import { translateMessage } from '@/lib/i18n-utils';
import { fetchFormQuestions } from '../services/lead-project-api';
import { FormQuestion } from '../types/form-question.types';

export function useFormQuestions(language: string, enabled = true) {
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchFormQuestions(language);

      if (!response.status || !Array.isArray(response.data)) {
        throw new Error(response.message || translateMessage('Failed to load form questions.'));
      }

      setQuestions(response.data);
    } catch (err: any) {
      setError(err.message || translateMessage('Failed to load form questions.'));
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    if (!enabled) return;
    // Genuine external synchronization: fetches questions from the API on
    // mount/language change; loading/data/error are set from the async lifecycle.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetching; see comment above.
    load();
  }, [enabled, load]);

  return {
    questions,
    loading,
    error,
    reload: load,
  };
}
