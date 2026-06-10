'use client';

import { useMeetingBookingFlow } from '@/features/meetings';

export function useBookingWizard(onClose: () => void, onBooked?: () => void | Promise<void>) {
  return useMeetingBookingFlow({ onBooked, onClose });
}
