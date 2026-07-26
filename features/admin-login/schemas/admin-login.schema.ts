import { z } from 'zod';
import { translateMessage } from '@/lib/i18n-utils';

export const adminLoginSchema = z.object({
  email: z.string().email(translateMessage('Please enter a valid email')),
  password: z.string().min(1, translateMessage('Password is required')),
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
