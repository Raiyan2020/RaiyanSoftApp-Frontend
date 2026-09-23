import PublicNavbar from './public-navbar';
import PublicWebPageJsonLd from './public-web-page-json-ld';
import Footer from '@/components/landing/Footer';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

type PublicLayoutProps = {
  children: React.ReactNode;
  seo?: { title: string; description: string; path: string };
};

export default async function PublicLayout({ children, seo }: PublicLayoutProps) {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-20 text-[var(--text)] md:pt-24">
      {seo ? <PublicWebPageJsonLd title={seo.title} description={seo.description} path={seo.path} /> : null}
      <a href="#main-content" className="skip-link">{tt('Skip to content')}</a>
      {/* The navbar is fixed (not sticky); the wrapper's pt-20/md:pt-24 clears it. */}
      <PublicNavbar />
      <main id="main-content">{children}</main>
      {/* Same footer as the home page (screens/Landing.tsx). */}
      <Footer />
    </div>
  );
}
