import type { Metadata } from 'next';

export const siteConfig = {
  name: 'ريان سوفت',
  englishName: 'Raiyan Soft',
  defaultTitle: 'ريان سوفت | تطوير تطبيقات ومواقع ومتاجر إلكترونية',
  description:
    'ريان سوفت وكالة تقنية تبني تطبيقات الجوال، المواقع الإلكترونية، المتاجر الرقمية، والهويات البصرية بتجربة مستخدم واضحة وأداء جاهز للنمو.',
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
  '/blog',
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
  image = '/logo.webp',
  type = 'website',
  noIndex = false,
}: PublicMetadataOptions = {}): Metadata {
  const resolvedTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.defaultTitle;
  const canonical = getCanonicalUrl(path);

  return {
    title: resolvedTitle,
    description,
    keywords: siteConfig.keywords,
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical,
    },
    openGraph: {
      title: resolvedTitle,
      description,
      locale: siteConfig.locale,
      type,
      siteName: siteConfig.name,
      url: canonical,
      images: [{ url: image, width: 512, height: 512, alt: siteConfig.name }],
    },
    twitter: {
      card: 'summary',
      title: resolvedTitle,
      description,
      images: [image],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
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

export function createServiceJsonLd(service: { title: string; description: string; slug: string }) {
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
  };
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

export function createArticleJsonLd(post: { title: string; excerpt: string; slug: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url: getCanonicalUrl(`/blog/${post.slug}`),
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
    inLanguage: siteConfig.language,
  };
}
