import { z } from 'zod';
import { translateMessage } from '@/lib/i18n-utils';

export const adminProfileSchema = z.object({
  firstName: z.string().min(1, translateMessage('First name is required')),
  lastName: z.string().min(1, translateMessage('Last name is required')),
  phone: z.string().optional(),
  email: z
    .string()
    .min(1, translateMessage('Valid email is required'))
    .email(translateMessage('Valid email is required')),
  password: z
    .string()
    .min(8, translateMessage('Password must be at least 8 characters'))
    .optional()
    .or(z.literal('')),
});

export type AdminProfileValues = z.infer<typeof adminProfileSchema>;
