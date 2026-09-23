'use client';

import dynamic from 'next/dynamic';

// Lazy so the dialogs' form code only loads once someone opens one.
export const QuickBookingDialog = dynamic(() =>
  import('@/features/quick-actions/components/quick-action-dialogs').then((module) => module.QuickBookingDialog)
);
export const QuickLeadDialog = dynamic(() =>
  import('@/features/quick-actions/components/quick-action-dialogs').then((module) => module.QuickLeadDialog)
);
