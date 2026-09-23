import { z } from 'zod';
import { requiredPhoneSchema } from '@/lib/phone';

export const claimSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: requiredPhoneSchema,
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type ClaimValues = z.infer<typeof claimSchema>;
