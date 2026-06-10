'use client';

import React from 'react';
import { LeadProjectWizard } from '@/features/lead-project';

interface ProjectWizardProps {
  onClose: () => void;
  onComplete: (requestId?: string) => void;
  isLeadMode?: boolean;
  source?: string;
}

export default function ProjectWizard({
  onClose,
  onComplete,
  isLeadMode = false,
}: ProjectWizardProps) {
  return (
    <LeadProjectWizard
      onClose={onClose}
      onComplete={onComplete}
      isLeadMode={isLeadMode}
    />
  );
}
