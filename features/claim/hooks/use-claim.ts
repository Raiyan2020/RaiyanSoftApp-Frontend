import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { translateMessage } from '@/lib/i18n-utils';
import { leadStore } from '@/lib/leadStore';
import { authService } from '@/lib/auth-service';
import { useTranslation } from '@/lib/i18nContext';
import { globalToast } from '@/lib/toast-context';
import { ClaimValues } from '../schemas/claim.schema';

export type ClaimStatus = 'validating' | 'valid' | 'invalid' | 'claiming' | 'success';

export function useClaim() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const router = useRouter();
  const { t, dir, language, setLanguage } = useTranslation();

  const [status, setStatus] = useState<ClaimStatus>('validating');
  const [errorMsg, setErrorMsg] = useState('');
  const [leadId, setLeadId] = useState<string | null>(null);

  useEffect(() => {
    // Genuine external synchronization: validates the claim token against
    // the API on mount/token change; status/error are set from the async
    // lifecycle (and the synchronous "missing token" branch below), not
    // derived from render state.
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above.
      setStatus('invalid');
      setErrorMsg('Missing token.');
      return;
    }

    leadStore.validateToken(token).then((res) => {
      if (res.valid && res.leadId) {
        setLeadId(res.leadId);
        setStatus('valid');
      } else {
        setStatus('invalid');
        setErrorMsg(res.error || 'Token invalid.');
      }
    });
  }, [token]);

  const handleClaim = async (data: ClaimValues) => {
    if (status !== 'valid' || !token || !leadId) return;

    setStatus('claiming');
    try {
      if (!authService.getUser()) {
        throw new Error(translateMessage('Please sign in before claiming this project.'));
      }

      await leadStore.claimProject(token, leadId);

      setStatus('success');
      setTimeout(() => {
        router.push('/profile?tab=project');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      globalToast.error(err.message || 'Unable to claim this project.');
      setStatus('valid');
    }
  };

  return {
    router,
    t,
    dir,
    language,
    setLanguage,
    status,
    errorMsg,
    handleClaim,
  };
}
