import { z } from 'zod';
import { translateMessage } from '@/lib/i18n-utils';

export const chatInputSchema = z.object({
  text: z.string().min(1, translateMessage('Message cannot be empty')),
});

export type ChatInputValues = z.infer<typeof chatInputSchema>;
