import type { Metadata } from 'next';
import { createPublicMetadata, siteConfig } from './site';
import type { AppLanguage } from './language';

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
    description: 'الوظائف المتاحة في ريان سوفت - انضم إلى فريق يبني منتجات رقمية واضحة.',
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

/** English counterparts of `pageSeo` (which is the Arabic, default-language copy). */
const pageSeoEn: Record<PageSeoKey, Omit<PageSeoEntry, 'path'>> = {
  home: { title: siteConfig.englishDefaultTitle, description: siteConfig.englishDescription },
  about: {
    title: 'About Us',
    description: 'Get to know Raiyan Soft, how we work, and what makes a digital product clear and ready to grow.',
  },
  services: {
    title: 'Services',
    description: 'Raiyan Soft services in mobile app, website, and e-commerce development, brand identity, and user experience.',
  },
  portfolio: {
    title: 'Our Work',
    description: 'Selected work and case studies by Raiyan Soft across mobile apps, websites, and online stores.',
  },
  blog: {
    title: 'Blog',
    description: 'Practical articles on planning digital products, user experience, and development.',
  },
  pricing: {
    title: 'Pricing',
    description: 'Website, app, and digital product packages with clear pricing based on project scope.',
  },
  contact: {
    title: 'Contact Us',
    description: 'Contact Raiyan Soft to discuss your digital project or request an initial consultation.',
  },
  quote: {
    title: 'Request a Quote',
    description: 'Request a quote for an app, website, or online store project with Raiyan Soft.',
  },
  consultation: {
    title: 'Book a Consultation',
    description: 'Book an initial consultation with Raiyan Soft to discuss your project idea and choose the right path.',
  },
  faq: {
    title: 'FAQ',
    description: 'Answers to common questions about scope, timeline, delivery, and working with Raiyan Soft.',
  },
  testimonials: {
    title: 'Testimonials',
    description: 'Real client experiences with Raiyan Soft in app, website, and digital product development.',
  },
  partners: {
    title: 'Partners',
    description: 'Raiyan Soft technology and strategic partners supporting digital product delivery.',
  },
  team: {
    title: 'Our Team',
    description: 'Meet the Raiyan Soft product, design, and development team.',
  },
  careers: {
    title: 'Careers',
    description: 'Open positions at Raiyan Soft - join a team that builds clear digital products.',
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'How Raiyan Soft collects, uses, and protects your information when you use our services.',
  },
  terms: {
    title: 'Terms & Conditions',
    description: 'Terms and conditions for using the Raiyan Soft website and services.',
  },
};

export function getPageMetadata(key: PageSeoKey, language: AppLanguage = 'ar'): Metadata {
  const entry = language === 'ar' ? pageSeo[key] : { ...pageSeo[key], ...pageSeoEn[key] };
  if (key === 'home') {
    return createPublicMetadata({
      description: entry.description,
      path: entry.path,
      language,
    });
  }
  return createPublicMetadata({
    title: entry.title,
    description: entry.description,
    path: entry.path,
    language,
  });
}
