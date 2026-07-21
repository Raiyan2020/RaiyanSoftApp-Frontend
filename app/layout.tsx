import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import Script from 'next/script';
import { Suspense } from 'react';
import Providers from './providers';
import './globals.css';
import MetaPixelTracker from '@/components/MetaPixelTracker';
import { createOrganizationJsonLd, createPublicMetadata } from '@/lib/site';
import { getDirection } from '@/lib/language';
import { getServerLanguage } from '@/lib/language.server';

const cairo = Cairo({ subsets: ['arabic', 'latin'], weight: ['300', '400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = createPublicMetadata();

// Disable static prerendering because app pages depend on client-side providers.
export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = createOrganizationJsonLd();
  const language = await getServerLanguage();

  return (
    <html lang={language} dir={getDirection(language)} className="dark" suppressHydrationWarning>
      <head>
        <script
          id="landing-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={cairo.className}>
        <Providers initialLanguage={language}>
          <Suspense fallback={null}>
            <MetaPixelTracker />
          </Suspense>
          {children}
        </Providers>
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
