import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18nContext';
import { translateMessage } from '@/lib/i18n-utils';

export function useLeadCapture() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams?.get('source') || 'direct';
  const [isCompleted, setIsCompleted] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const { dir, language } = useTranslation();

  const handleComplete = (id?: string) => {
    if (id) setRequestId(id);
    router.push('/profile?tab=project');
  };

  const getWhatsAppLink = () => {
    if (!requestId) return '';
    const text = translateMessage('Confirm request #{id}', language).replace('{id}', requestId);
    const encodedText = encodeURIComponent(text);
    return `https://wa.me/96560070353?text=${encodedText}`;
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
    getWhatsAppLink,
    handleWizardClose,
  };
}
