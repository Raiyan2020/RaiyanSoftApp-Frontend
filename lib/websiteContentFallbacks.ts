import {
  blogPosts,
  partners,
  portfolioItems,
  pricingPackages,
  publicFaqs,
  publicServices,
  teamMembers,
  testimonials,
} from './public-content';
import type { WebsiteContentItem, WebsiteContentSection } from '@/features/admin-website/types/website-content';

const base = (section: WebsiteContentSection, index: number): Omit<WebsiteContentItem, 'title' | 'data'> => ({
  id: `${section}-fallback-${index}`,
  status: 'published',
  order: index,
  featured: index < 3,
  locale: 'ar',
  seoTitle: '',
  seoDescription: '',
  ogImage: '',
});

export const websiteContentFallbacks: Record<WebsiteContentSection, WebsiteContentItem[]> = {
  homepage: [
    {
      ...base('homepage', 0),
      title: 'Homepage',
      slug: 'home',
      data: {
        headline: 'منتجات رقمية واضحة من الفكرة إلى الإطلاق',
        subtitle: 'محتوى افتراضي آمن إلى حين إدارة الصفحة من لوحة التحكم.',
      },
    },
  ],
  services: publicServices.map((service, index) => ({
    ...base('services', index),
    title: service.title,
    slug: service.slug,
    data: service,
  })),
  apps: portfolioItems.map((item, index) => ({
    ...base('apps', index),
    title: item.title,
    slug: item.slug,
    data: item,
    approval: { clientApproved: !item.isPlaceholder },
  })),
  blog: blogPosts.map((post, index) => ({
    ...base('blog', index),
    title: post.title,
    slug: post.slug,
    data: post,
  })),
  steps: [],
  faqs: publicFaqs.map((faq, index) => ({
    ...base('faqs', index),
    title: faq.question,
    slug: `faq-${index + 1}`,
    data: faq,
  })),
  pricing: pricingPackages.map((pack, index) => ({
    ...base('pricing', index),
    title: pack.name,
    slug: pack.name,
    data: pack,
  })),
  testimonials: testimonials.map((item, index) => ({
    ...base('testimonials', index),
    title: item.author,
    data: item,
    approval: { approvedForPublic: !item.isPlaceholder },
  })),
  partners: partners.map((item, index) => ({
    ...base('partners', index),
    title: item.name,
    data: item,
    approval: { approvedForPublic: !item.isPlaceholder },
  })),
  team: teamMembers.map((item, index) => ({
    ...base('team', index),
    title: item.name,
    data: item,
  })),
  careers: [],
  legal: [],
  settings: [],
};

