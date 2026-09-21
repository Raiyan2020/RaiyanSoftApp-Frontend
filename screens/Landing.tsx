import LandingShell from './LandingShell';
import Services from '@/components/landing/Services';
import Works from '@/components/landing/Works';
import Packages from '@/components/landing/Packages';
import AboutUs from '@/components/landing/AboutUs';
import Partners from '@/components/landing/Partners';
import Insights from '@/components/landing/Insights';
import FAQ from '@/components/landing/FAQ';
import FinalCta from '@/components/landing/FinalCta';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';
import type { LandingPageContent } from '@/features/landing-page';

type LandingBlogPost = { slug: string; title: string; excerpt: string; category?: string };

type LandingPageProps = {
  blogPosts?: LandingBlogPost[];
  homeData?: LandingPageContent | null;
};

export default function LandingPage({ blogPosts = [], homeData }: LandingPageProps) {
  return (
    <div
      className="min-h-screen bg-[var(--bg)] text-[var(--text)]"
      data-landing-home-heroes={homeData?.heroes.length ?? 0}
    >
      <LandingShell homeData={homeData} />
      <main id="main-content">
        <Services homeData={homeData} />
        <Works homeData={homeData} />
        <Packages homeData={homeData} />
        <AboutUs homeData={homeData} />
        <Partners homeData={homeData} />
        <Insights posts={blogPosts} />
        <FAQ homeData={homeData} />
        <FinalCta homeData={homeData} />
        <Contact homeData={homeData} />
        <Footer homeData={homeData} />
      </main>
    </div>
  );
}
