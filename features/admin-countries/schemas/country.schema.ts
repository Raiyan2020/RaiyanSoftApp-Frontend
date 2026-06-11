import { z } from 'zod';
import { translateMessage } from '@/lib/i18n-utils';

export const adminCountrySchema = z.object({
  name: z.string().trim().min(1, translateMessage('Country name is required')),
  countryCode: z.string().trim().min(1, translateMessage('Country code is required')),
  phoneCode: z.string().trim().min(1, translateMessage('Phone code is required')),
  isActive: z.boolean(),
});

export type AdminCountryValues = z.infer<typeof adminCountrySchema>;
