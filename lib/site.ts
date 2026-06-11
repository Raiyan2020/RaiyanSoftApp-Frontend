import type { Metadata } from 'next';

export const siteConfig = {
  name: 'ريان سوفت',
  englishName: 'Raiyan Soft',
  defaultTitle: 'ريان سوفت | تطوير تطبيقات ومواقع ومتاجر إلكترونية',
  description:
    'ريان سوفت وكالة تقنية تبني تطبيقات الجوال، المواقع الإلكترونية، المتاجر الرقمية، والهويات البصرية بتجربة مستخدم واضحة وأداء جاهز للنمو.',
  ogImage: '/opengraph-image',
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
    name: siteConfig.name,
    alternateName: siteConfig.englishName,
    description: siteConfig.description,
    url: getCanonicalUrl('/'),
    inLanguage: siteConfig.language,
    publisher: {
      '@type': 'Organization',
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
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'ProfessionalService',
      name: siteConfig.name,
      url: getCanonicalUrl('/'),
    },
    areaServed: siteConfig.country,
    url: getCanonicalUrl(`/services/${service.slug}`),
    hasOfferCatalog: service.deliverables?.length
      ? {
          '@type': 'OfferCatalog',
          name: service.title,
          itemListElement: service.deliverables.map((item) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: item,
            },
          })),
        }
      : undefined,
  };
}

export function createServiceCollectionJsonLd(services: { title: string; description: string; slug: string }[]) {
  return createItemListJsonLd(
    services.map((service) => ({
      name: service.title,
      description: service.description,
      url: getCanonicalUrl(`/services/${service.slug}`),
    })),
    'خدمات ريان سوفت',
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
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    url: getCanonicalUrl(page.path),
    inLanguage: siteConfig.language,
    isPartOf: {
      '@type': 'WebSite',
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

export function createOfferCatalogJsonLd(items: { name: string; description: string; features?: string[] }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'باقات ريان سوفت',
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

export function createReviewListJsonLd(items: { quote: string; author: string; role?: string; company?: string }[]) {
  return createItemListJsonLd(
    items.map((item) => ({
      name: item.author,
      description: item.quote,
      url: getCanonicalUrl('/testimonials'),
    })),
    'آراء عملاء ريان سوفت',
  );
}

export function createPeopleListJsonLd(items: { name?: string; title?: string; role?: string; bio?: string }[]) {
  return createItemListJsonLd(
    items.map((item) => ({
      name: item.name || item.title || siteConfig.name,
      description: [item.role, item.bio].filter(Boolean).join(' - '),
      url: getCanonicalUrl('/team'),
    })),
    'فريق ريان سوفت',
  );
}

export function createJobPostingListJsonLd(items: { title: string; department?: string; location?: string; workType?: string; description: string }[]) {
  return createItemListJsonLd(
    items.map((item) => ({
      name: item.title,
      description: [item.department, item.location, item.workType, item.description].filter(Boolean).join(' - '),
      url: getCanonicalUrl('/careers'),
    })),
    'وظائف ريان سوفت',
  );
}

export function createCreativeWorkJsonLd(item: { slug: string; title: string; summary: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: item.title,
    description: item.summary,
    url: getCanonicalUrl(`/portfolio/${item.slug}`),
    creator: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: getCanonicalUrl('/'),
    },
    inLanguage: siteConfig.language,
  };
}

export function createArticleJsonLd(post: { title: string; excerpt: string; slug: string; category?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url: getCanonicalUrl(`/blogs/${post.slug}`),
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
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
