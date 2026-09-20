'use client';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import HeroBanner from '@/components/landing/HeroBanner';
import type { LandingPageContent } from '@/features/landing-page';
import { useLanding } from './use-landing';
import { useTranslation } from '@/lib/i18nContext';

// Below-the-fold sections: lazy-loaded to keep them out of the initial bundle.
// ssr stays true (the default) so the HTML still contains the content for SEO.
const Services = dynamic(() => import('@/components/landing/Services'));
const Works = dynamic(() => import('@/components/landing/Works'));
const Packages = dynamic(() => import('@/components/landing/Packages'));
const AboutUs = dynamic(() => import('@/components/landing/AboutUs'));
const Partners = dynamic(() => import('@/components/landing/Partners'));
const Insights = dynamic(() => import('@/components/landing/Insights'));
const FAQ = dynamic(() => import('@/components/landing/FAQ'));
const FinalCta = dynamic(() => import('@/components/landing/FinalCta'));
const Contact = dynamic(() => import('@/components/landing/Contact'));
const Footer = dynamic(() => import('@/components/landing/Footer'));

type LandingBlogPost = { slug: string; title: string; excerpt: string; category?: string };

type LandingPageProps = {
  blogPosts?: LandingBlogPost[];
  homeData?: LandingPageContent | null;
};

export default function LandingPage({ blogPosts = [], homeData }: LandingPageProps) {
  const {
    dark,
    scrollProgress,
    shouldReduceMotion,
    toggleDark,
    pageVariants,
    sectionVariants,
  } = useLanding();
  const { t } = useTranslation();

  return (
    <div
      className="min-h-screen bg-[var(--bg)] text-[var(--text)]"
      data-landing-home-heroes={homeData?.heroes.length ?? 0}
    >
      <a href="#main-content" className="skip-link">{t('Skip to content')}</a>
      <div className="scroll-progress" style={{ '--scroll-progress': `${scrollProgress}%` } as React.CSSProperties} />
      <Navbar dark={dark} onToggleDark={toggleDark} />
      <motion.main id="main-content" variants={pageVariants} initial={false} animate="visible">
        <motion.div variants={sectionVariants}><HeroBanner homeData={homeData} /></motion.div>
        <motion.div variants={sectionVariants}><Services homeData={homeData} /></motion.div>
        {/* <motion.div variants={sectionVariants}><Sectors /></motion.div> */}
        <motion.div variants={sectionVariants}><Works homeData={homeData} /></motion.div>
        <motion.div variants={sectionVariants}><Packages homeData={homeData} /></motion.div>
        <motion.div variants={sectionVariants}><AboutUs homeData={homeData} /></motion.div>
        <motion.div variants={sectionVariants}><Partners homeData={homeData} /></motion.div>
        <motion.div variants={sectionVariants}><Insights posts={blogPosts} /></motion.div>
        <motion.div variants={sectionVariants}><FAQ homeData={homeData} /></motion.div>
        <motion.div variants={sectionVariants}><FinalCta homeData={homeData} /></motion.div>
        <motion.div variants={sectionVariants}><Contact homeData={homeData} /></motion.div>
      </motion.main>
      <Footer homeData={homeData} />
    </div>
  );
}
