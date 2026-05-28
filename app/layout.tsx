import type { Metadata } from 'next';
import { Alexandria } from 'next/font/google';
import Script from 'next/script';
import Providers from './providers';
import './globals.css';
import MetaPixelTracker from '@/components/MetaPixelTracker';

const alexandria = Alexandria({ subsets: ['arabic', 'latin'], weight: ['300', '400', '500', '600', '700'] });

const title = 'رايان سوفت | تطوير تطبيقات ومواقع ومتاجر إلكترونية';
const description = 'رايان سوفت وكالة تقنية سعودية لبناء تطبيقات الجوال، المواقع الإلكترونية، المتاجر الرقمية، والهويات البصرية باحترافية وسرعة وتجربة مستخدم عالية الجودة.';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['تطوير تطبيقات', 'تصميم مواقع', 'متاجر إلكترونية', 'شركة برمجة سعودية', 'تصميم هوية بصرية', 'Next.js', 'تطبيقات جوال'],
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title,
    description,
    locale: 'ar_SA',
    type: 'website',
    siteName: 'رايان سوفت',
    images: [{ url: '/logo.webp', width: 512, height: 512, alt: 'رايان سوفت' }],
  },
  twitter: {
    card: 'summary',
    title,
    description,
    images: ['/logo.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Disable static prerendering because app pages depend on client-side providers.
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'رايان سوفت',
    description,
    areaServed: 'SA',
    serviceType: ['تطوير تطبيقات الجوال', 'تصميم المواقع', 'المتاجر الإلكترونية', 'الهوية البصرية'],
    url: 'http://localhost:3000/',
  };

  return (
    <html lang="ar" dir="rtl">
      <body className={alexandria.className}>
        <Providers>
          <MetaPixelTracker />
          {children}
        </Providers>
        <Script id="landing-schema" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(jsonLd)}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '4244544699119323');
            fbq('track', 'PageView');
          `}
        </Script>
      </body>
    </html>
  );
}
