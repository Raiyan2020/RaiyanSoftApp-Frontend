'use client';
import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import HeroBanner from '@/components/landing/HeroBanner';
import Services from '@/components/landing/Services';
import Sectors from '@/components/landing/Sectors';
import Works from '@/components/landing/Works';
import Packages from '@/components/landing/Packages';
import Partners from '@/components/landing/Partners';
import Insights from '@/components/landing/Insights';
import FAQ from '@/components/landing/FAQ';
import FinalCta from '@/components/landing/FinalCta';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';
import { useLanding } from './use-landing';

type LandingBlogPost = { slug: string; title: string; excerpt: string; category?: string };

type LandingPageProps = {
  blogPosts?: LandingBlogPost[];
};

export default function LandingPage({ blogPosts = [] }: LandingPageProps) {
  const {
    dark,
    scrollProgress,
    shouldReduceMotion,
    toggleDark,
    pageVariants,
    sectionVariants,
  } = useLanding();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <a href="#main-content" className="skip-link">تجاوز إلى المحتوى</a>
      <div className="scroll-progress" style={{ '--scroll-progress': `${scrollProgress}%` } as React.CSSProperties} />
      <Navbar dark={dark} onToggleDark={toggleDark} />
      <motion.main id="main-content" variants={pageVariants} initial={shouldReduceMotion ? false : 'hidden'} animate="visible">
        <motion.div variants={sectionVariants}><HeroBanner /></motion.div>
        <motion.div variants={sectionVariants}><Services /></motion.div>
        {/* <motion.div variants={sectionVariants}><Sectors /></motion.div> */}
        <motion.div variants={sectionVariants}><Works /></motion.div>
        <motion.div variants={sectionVariants}><Packages /></motion.div>
        <motion.div variants={sectionVariants}><Partners /></motion.div>
        <motion.div variants={sectionVariants}><Insights posts={blogPosts} /></motion.div>
        <motion.div variants={sectionVariants}><FAQ /></motion.div>
        <motion.div variants={sectionVariants}><FinalCta /></motion.div>
        <motion.div variants={sectionVariants}><Contact /></motion.div>
      </motion.main>
      <Footer />
    </div>
  );
}
