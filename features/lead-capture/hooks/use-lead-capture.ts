import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/lib/i18nContext';

export function useLeadCapture() {
  const searchParams = useSearchParams();
  const source = searchParams?.get('source') || 'direct';
  const [isCompleted, setIsCompleted] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const { dir, language } = useTranslation();

  const handleComplete = (id?: string) => {
    if (id) setRequestId(id);
    setIsCompleted(true);
  };

  const handleWizardClose = () => {
    window.location.href = 'https://raiyansoft.com';
  };

  return {
    source,
    isCompleted,
    requestId,
    dir,
    language,
    handleComplete,
    handleWizardClose,
  };
}
