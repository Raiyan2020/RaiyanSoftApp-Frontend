import type { Metadata } from 'next';
import { translateMessage } from './i18n-utils';

export const siteConfig = {
  name: 'ريان سوفت',
  englishName: 'Raiyan Soft',
  defaultTitle: 'ريان سوفت | تطوير تطبيقات ومواقع ومتاجر إلكترونية',
  description:
    'ريان سوفت وكالة تقنية تبني تطبيقات الجوال، المواقع الإلكترونية، المتاجر الرقمية، والهويات البصرية بتجربة مستخدم واضحة وأداء جاهز للنمو.',
  ogImage: '/og-image.svg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  locale: 'ar_SA',
  language: 'ar',
  direction: 'rtl',
  phone: '+966 50 000 0000',
  email: 'info@raiyansoft.com',
  country: 'SA',
  keywords: [
    'تطوير تطبيقات',
    'تصميم مواقع',
    'متاجر إلكترونية',
    'شركة برمجة سعودية',
    'تصميم هوية بصرية',
    'تطبيقات جوال',
    'تطوير Next.js',
  ],
  services: [
    'تطوير تطبيقات الجوال',
    'تصميم وتطوير المواقع',
    'تطوير المتاجر الإلكترونية',
    'تصميم الهوية البصرية',
    'تصميم تجربة المستخدم',
  ],
};

export const publicRoutes = [
  '/',
  '/about',
  '/services',
  '/services/mobile-app-development',
  '/services/web-development',
  '/services/ecommerce-development',
  '/services/branding-ui-ux',
  '/portfolio',
  '/blogs',
  '/blogs/categories',
  '/pricing',
  '/contact',
  '/quote',
  '/consultation',
  '/faq',
  '/testimonials',
  '/partners',
  '/team',
  '/careers',
  '/privacy',
  '/terms',
  '/pages',
] as const;

export type PublicRoute = (typeof publicRoutes)[number];

export function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://raiyansoft.com';
  return url.replace(/\/$/, '');
}

export function getCanonicalUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

type PublicMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
};

export function createPublicMetadata({
  title,
  description = siteConfig.description,
  path = '/',
  image = siteConfig.ogImage,
  type = 'website',
  noIndex = false,
}: PublicMetadataOptions = {}): Metadata {
  const resolvedTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.defaultTitle;
  const canonical = getCanonicalUrl(path);
  const ogImage = image.startsWith('http') ? image : getCanonicalUrl(image.startsWith('/') ? image.slice(1) : image);

  return {
    title: resolvedTitle,
    description,
    keywords: siteConfig.keywords,
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical,
      languages: {
        ar: canonical,
      },
    },
    openGraph: {
      title: resolvedTitle,
      description,
      locale: siteConfig.locale,
      type,
      siteName: siteConfig.name,
      url: canonical,
      images: [
        {
          url: ogImage,
          width: siteConfig.ogImageWidth,
          height: siteConfig.ogImageHeight,
          alt: resolvedTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function createOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${getCanonicalUrl('/')}#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.englishName,
    description: siteConfig.description,
    url: getCanonicalUrl('/'),
    logo: getCanonicalUrl('/logo.webp'),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    areaServed: siteConfig.country,
    serviceType: siteConfig.services,
    inLanguage: siteConfig.language,
  };
}

export function createWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${getCanonicalUrl('/')}#website`,
    name: siteConfig.name,
    alternateName: siteConfig.englishName,
    description: siteConfig.description,
    url: getCanonicalUrl('/'),
    inLanguage: siteConfig.language,
    publisher: {
      '@type': 'Organization',
      '@id': `${getCanonicalUrl('/')}#organization`,
      name: siteConfig.name,
      url: getCanonicalUrl('/'),
    },
  };
}

export function createBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function createPageBreadcrumbJsonLd(page: { title: string; path: string }) {
  const items = [{ name: siteConfig.name, url: getCanonicalUrl('/') }];

  if (page.path !== '/') {
    items.push({ name: page.title, url: getCanonicalUrl(page.path) });
  }

  return createBreadcrumbJsonLd(items);
}

export function createItemListJsonLd(items: { name: string; url: string; description?: string }[], name?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: item.url,
      name: item.name,
      description: item.description,
    })),
  };
}

export function createServiceJsonLd(service: { title: string; description: string; slug: string; outcomes?: string[]; deliverables?: string[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${getCanonicalUrl(`/services/${service.slug}`)}#service`,
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'ProfessionalService',
      '@id': `${getCanonicalUrl('/')}#organization`,
      name: siteConfig.name,
      url: getCanonicalUrl('/'),
    },
    areaServed: siteConfig.country,
    url: getCanonicalUrl(`/services/${service.slug}`),
    serviceType: service.title,
  };
}

export function createServiceCollectionJsonLd(services: { title: string; description: string; slug: string }[], language: 'ar' | 'en' = 'ar') {
  return createItemListJsonLd(
    services.map((service) => ({
      name: service.title,
      description: service.description,
      url: getCanonicalUrl(`/services/${service.slug}`),
    })),
    translateMessage('Raiyan Soft services', language),
  );
}

export function createFaqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function createWebPageJsonLd(page: { title: string; description: string; path: string }) {
  const url = getCanonicalUrl(page.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    name: page.title,
    description: page.description,
    url,
    inLanguage: siteConfig.language,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${getCanonicalUrl('/')}#website`,
      name: siteConfig.name,
      url: getCanonicalUrl('/'),
    },
  };
}

export function createCollectionPageJsonLd(page: { title: string; description: string; path: string }) {
  return {
    ...createWebPageJsonLd(page),
    '@type': 'CollectionPage',
  };
}

export function createAboutPageJsonLd(page: { title: string; description: string; path: string }) {
  return {
    ...createWebPageJsonLd(page),
    '@type': 'AboutPage',
    about: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: getCanonicalUrl('/'),
    },
  };
}

export function createContactPageJsonLd(page: { title: string; description: string; path: string }) {
  return {
    ...createWebPageJsonLd(page),
    '@type': 'ContactPage',
    contactPoint: {
      '@type': 'ContactPoint',
      email: siteConfig.email,
      telephone: siteConfig.phone,
      contactType: 'customer support',
      areaServed: siteConfig.country,
      availableLanguage: [siteConfig.language, 'en'],
    },
  };
}

export function createLegalPageJsonLd(page: { title: string; description: string; path: string }) {
  return {
    ...createWebPageJsonLd(page),
    '@type': 'WebPage',
    genre: 'Legal',
  };
}

export function createOfferCatalogJsonLd(items: { name: string; description: string; features?: string[] }[], language: 'ar' | 'en' = 'ar') {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: translateMessage('Raiyan Soft packages', language),
    itemListElement: items.map((item) => ({
      '@type': 'Offer',
      name: item.name,
      description: item.description,
      itemOffered: {
        '@type': 'Service',
        name: item.name,
        description: item.features?.join('، '),
      },
    })),
  };
}

export function createReviewListJsonLd(items: { quote: string; author: string; role?: string; company?: string }[], language: 'ar' | 'en' = 'ar') {
  return createItemListJsonLd(
    items.map((item) => ({
      name: item.author,
      description: item.quote,
      url: getCanonicalUrl('/testimonials'),
    })),
    translateMessage('Raiyan Soft customer reviews', language),
  );
}

export function createPeopleListJsonLd(items: { name?: string; title?: string; role?: string; bio?: string }[], language: 'ar' | 'en' = 'ar') {
  return createItemListJsonLd(
    items.map((item) => ({
      name: item.name || item.title || siteConfig.name,
      description: [item.role, item.bio].filter(Boolean).join(' - '),
      url: getCanonicalUrl('/team'),
    })),
    translateMessage('Raiyan Soft team', language),
  );
}

export function createJobPostingListJsonLd(items: { title: string; department?: string; location?: string; workType?: string; description: string }[], language: 'ar' | 'en' = 'ar') {
  return createItemListJsonLd(
    items.map((item) => ({
      name: item.title,
      description: [item.department, item.location, item.workType, item.description].filter(Boolean).join(' - '),
      url: getCanonicalUrl('/careers'),
    })),
    translateMessage('Raiyan Soft jobs', language),
  );
}

export function createCreativeWorkJsonLd(item: { slug: string; title: string; summary: string }) {
  const url = getCanonicalUrl(`/portfolio/${item.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#work`,
    name: item.title,
    description: item.summary,
    url,
    creator: {
      '@type': 'Organization',
      '@id': `${getCanonicalUrl('/')}#organization`,
      name: siteConfig.name,
      url: getCanonicalUrl('/'),
    },
    inLanguage: siteConfig.language,
  };
}

export function createArticleJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  category?: string;
  image?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}) {
  const url = getCanonicalUrl(`/blogs/${post.slug}`);
  const datePublished = post.published_at || post.created_at || undefined;
  const dateModified = post.updated_at || undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${url}#webpage` },
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author: {
      '@type': 'Organization',
      '@id': `${getCanonicalUrl('/')}#organization`,
      name: siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${getCanonicalUrl('/')}#organization`,
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: getCanonicalUrl('/logo.webp'),
      },
    },
    articleSection: post.category,
    inLanguage: siteConfig.language,
  };
}
