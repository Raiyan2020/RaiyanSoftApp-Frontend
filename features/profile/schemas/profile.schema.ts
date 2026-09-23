import { z } from 'zod';
import { requiredPhoneSchema } from '@/lib/phone';

export const userProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: requiredPhoneSchema,
});

export type UserProfileValues = z.infer<typeof userProfileSchema>;
