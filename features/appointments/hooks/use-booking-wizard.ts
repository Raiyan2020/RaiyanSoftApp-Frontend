'use client';

import { useMeetingBookingFlow } from '@/features/meetings/hooks/use-meeting-booking-flow';

export function useBookingWizard(_onClose: () => void) {
  return useMeetingBookingFlow();
}
