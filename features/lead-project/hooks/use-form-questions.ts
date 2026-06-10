'use client';

import { useCallback, useEffect, useState } from 'react';
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
        throw new Error(response.message || 'Failed to load form questions.');
      }

      setQuestions(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load form questions.');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    if (!enabled) return;
    load();
  }, [enabled, load]);

  return {
    questions,
    loading,
    error,
    reload: load,
  };
}
