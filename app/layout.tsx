import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import Script from 'next/script';
import Providers from './providers';
import './globals.css';
import MetaPixelTracker from '@/components/MetaPixelTracker';
import { createOrganizationJsonLd, createPublicMetadata, siteConfig } from '@/lib/site';

const cairo = Cairo({ subsets: ['arabic', 'latin'], weight: ['300', '400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = createPublicMetadata();

// Disable static prerendering because app pages depend on client-side providers.
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = createOrganizationJsonLd();

  return (
    <html lang={siteConfig.language} dir={siteConfig.direction}>
      <body className={cairo.className}>
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {`
            try {
              var theme = localStorage.getItem('theme') || 'dark';
              document.documentElement.classList.toggle('dark', theme === 'dark');
            } catch (_) {
              document.documentElement.classList.add('dark');
            }
          `}
        </Script>
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

