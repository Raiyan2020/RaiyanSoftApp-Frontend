import type { Metadata } from 'next';
import { createPublicMetadata, siteConfig } from './site';

export type PageSeoKey =
  | 'home'
  | 'about'
  | 'services'
  | 'portfolio'
  | 'blog'
  | 'pricing'
  | 'contact'
  | 'quote'
  | 'consultation'
  | 'faq'
  | 'testimonials'
  | 'partners'
  | 'team'
  | 'careers'
  | 'privacy'
  | 'terms';

type PageSeoEntry = {
  title: string;
  description: string;
  path: string;
};

export const pageSeo: Record<PageSeoKey, PageSeoEntry> = {
  home: {
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    path: '/',
  },
  about: {
    title: 'من نحن',
    description: 'تعرف على ريان سوفت، طريقة العمل، وما الذي يجعل المنتج الرقمي واضحاً وقابلاً للنمو.',
    path: '/about',
  },
  services: {
    title: 'الخدمات',
    description: 'خدمات ريان سوفت في تطوير تطبيقات الجوال والمواقع والمتاجر الإلكترونية والهوية وتجربة المستخدم.',
    path: '/services',
  },
  portfolio: {
    title: 'الأعمال',
    description: 'نماذج من أعمال ودراسات حالة ريان سوفت في تطبيقات الجوال والمواقع والمتاجر.',
    path: '/portfolio',
  },
  blog: {
    title: 'المدونة',
    description: 'مقالات عملية حول التخطيط للمنتجات الرقمية وتجربة المستخدم والتطوير.',
    path: '/blogs',
  },
  pricing: {
    title: 'الأسعار',
    description: 'باقات مواقع وتطبيقات ومنتجات رقمية بأسعار واضحة حسب نطاق المشروع.',
    path: '/pricing',
  },
  contact: {
    title: 'تواصل معنا',
    description: 'تواصل مع ريان سوفت لمناقشة مشروعك الرقمي أو طلب استشارة أولى.',
    path: '/contact',
  },
  quote: {
    title: 'طلب عرض سعر',
    description: 'اطلب عرض سعر لمشروع تطبيق أو موقع أو متجر إلكتروني مع ريان سوفت.',
    path: '/quote',
  },
  consultation: {
    title: 'حجز استشارة',
    description: 'احجز استشارة أولية مع ريان سوفت لمناقشة فكرة مشروعك وتحديد المسار المناسب.',
    path: '/consultation',
  },
  faq: {
    title: 'الأسئلة الشائعة',
    description: 'إجابات عن الأسئلة الشائعة حول النطاق، الجدول الزمني، التسليم، والتعاون مع ريان سوفت.',
    path: '/faq',
  },
  testimonials: {
    title: 'آراء العملاء',
    description: 'تجارب عملاء حقيقية مع ريان سوفت في تطوير التطبيقات والمواقع والمنتجات الرقمية.',
    path: '/testimonials',
  },
  partners: {
    title: 'الشركاء',
    description: 'شركاء ريان سوفت التقنيون والاستراتيجيون في دعم تنفيذ المنتجات الرقمية.',
    path: '/partners',
  },
  team: {
    title: 'فريق العمل',
    description: 'تعرف على فريق ريان سوفت في المنتج، التصميم، والتطوير.',
    path: '/team',
  },
  careers: {
    title: 'الوظائف',
    description: 'الوظائف المتاحة في ريان سوفت — انضم إلى فريق يبني منتجات رقمية واضحة.',
    path: '/careers',
  },
  privacy: {
    title: 'سياسة الخصوصية',
    description: 'كيف تجمع ريان سوفت معلوماتك ونستخدمها ونحميها عند استخدام خدماتنا.',
    path: '/privacy',
  },
  terms: {
    title: 'الشروط والأحكام',
    description: 'الشروط والأحكام لاستخدام موقع وخدمات ريان سوفت.',
    path: '/terms',
  },
};

export function getPageMetadata(key: PageSeoKey): Metadata {
  const entry = pageSeo[key];
  if (key === 'home') {
    return createPublicMetadata({
      description: entry.description,
      path: entry.path,
    });
  }
  return createPublicMetadata({
    title: entry.title,
    description: entry.description,
    path: entry.path,
  });
}
