import DeferredLandingSections from '@/components/landing/DeferredLandingSections';
import LandingShell from './LandingShell';
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
        <DeferredLandingSections blogPosts={blogPosts} homeData={homeData} />
      </main>
    </div>
  );
}
