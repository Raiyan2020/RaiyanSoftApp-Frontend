'use client';

import { useEffect, useState } from 'react';
import type { LandingPageContent } from '@/features/landing-page';

type LandingBlogPost = { slug: string; title: string; excerpt: string; category?: string };

type DeferredLandingSectionsProps = {
  blogPosts: LandingBlogPost[];
  homeData?: LandingPageContent | null;
};

export default function DeferredLandingSections({ blogPosts, homeData }: DeferredLandingSectionsProps) {
  const [sections, setSections] = useState<React.ReactNode>(null);

  useEffect(() => {
    let loaded = false;

    const loadSections = async () => {
      if (loaded) return;
      loaded = true;
      const [services, works, packages, aboutUs, partners, insights, faq, finalCta, contact, footer] = await Promise.all([
        import('./Services'),
        import('./Works'),
        import('./Packages'),
        import('./AboutUs'),
        import('./Partners'),
        import('./Insights'),
        import('./FAQ'),
        import('./FinalCta'),
        import('./Contact'),
        import('./Footer'),
      ]);

      setSections(
        <>
          <services.default homeData={homeData} />
          <works.default homeData={homeData} />
          <packages.default homeData={homeData} />
          <aboutUs.default homeData={homeData} />
          <partners.default homeData={homeData} />
          <insights.default posts={blogPosts} />
          <faq.default homeData={homeData} />
          <finalCta.default homeData={homeData} />
          <contact.default homeData={homeData} />
          <footer.default homeData={homeData} />
        </>
      );
    };

    const interactionEvents: Array<keyof WindowEventMap> = ['scroll', 'pointerdown', 'keydown'];
    interactionEvents.forEach((event) => window.addEventListener(event, loadSections, { once: true, passive: true }));

    return () => {
      interactionEvents.forEach((event) => window.removeEventListener(event, loadSections));
    };
  }, [blogPosts, homeData]);

  return sections;
}
