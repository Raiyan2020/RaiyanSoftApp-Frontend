import { z } from 'zod';

export const websiteContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  order: z.string().optional(),
  featured: z.boolean(),
  locale: z.string().min(1, 'Locale is required'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImage: z.string().optional(),
  approvedForPublic: z.boolean(),
  clientApproved: z.boolean(),
  data: z.record(z.string(), z.any()),
});

export type WebsiteContentValues = z.infer<typeof websiteContentSchema>;

