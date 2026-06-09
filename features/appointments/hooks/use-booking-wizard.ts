'use client';

import { useMeetingBookingFlow } from '@/features/meetings/hooks/use-meeting-booking-flow';

export function useBookingWizard(onClose: () => void, onBooked?: () => void | Promise<void>) {
  return useMeetingBookingFlow({ onBooked, onClose });
}
