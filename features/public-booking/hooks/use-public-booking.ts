'use client';

import { useMeetingBookingFlow } from '@/features/meetings/hooks/use-meeting-booking-flow';

export function usePublicBooking() {
  return useMeetingBookingFlow();
}
