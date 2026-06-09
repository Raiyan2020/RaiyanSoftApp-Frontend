'use client';

import { useRouter } from 'next/navigation';
import { useMeetingBookingFlow } from '@/features/meetings/hooks/use-meeting-booking-flow';

export function usePublicBooking() {
  const router = useRouter();

  return useMeetingBookingFlow({
    onBooked: () => router.push('/profile?tab=booking'),
  });
}
