import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { LeadProjectWizard, LeadContactChoiceModal } from '@/features/lead-project';
import { translateMessage } from '@/lib/i18n-utils';
import { useLeadCapture } from '../hooks/use-lead-capture';

export default function LeadCapturePage() {
  const { isCompleted, requestId, dir, language, handleComplete, handleWizardClose } = useLeadCapture();
  const [showContactChoice, setShowContactChoice] = useState(false);

  const onComplete = (id?: string) => {
    handleComplete(id);
    setShowContactChoice(true);
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-screen bg-[var(--bg)] text-[var(--text)] p-6" dir={dir}>
        <motion.div
          initial={false}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[var(--surface-3)] border border-[var(--border)] rounded-3xl p-8 max-w-sm w-full text-center"
        >
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">
            {translateMessage('Request Received', language)}
          </h1>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">
            {translateMessage(
              'Thank you for sharing your vision. Our team is reviewing your project details and will contact you shortly.',
              language
            )}
          </p>
        </motion.div>

        {showContactChoice ? (
          <LeadContactChoiceModal
            requestId={requestId || undefined}
            onClose={() => setShowContactChoice(false)}
          />
        ) : null}
      </div>
    );
  }

  return <LeadProjectWizard onClose={handleWizardClose} onComplete={onComplete} isLeadMode />;
}
