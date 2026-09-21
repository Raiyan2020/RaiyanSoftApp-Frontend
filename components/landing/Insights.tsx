'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ArrowUpLeft } from 'lucide-react';
import { useSectionReveal } from './use-section-reveal';
import { translateMessage } from '@/lib/i18n-utils';
import { useTranslation } from '@/lib/i18nContext';

type BlogPreviewPost = {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
};

type InsightsProps = {
  posts: BlogPreviewPost[];
};

const fallbackPosts: BlogPreviewPost[] = [
  {
    slug: 'estimate-digital-product-cost',
    title: 'How do you estimate your digital product cost before you start?',
    category: 'Product Management',
    excerpt: 'A simple framework to understand project scope and the factors affecting cost and duration before the first meeting.',
  },
];

export default function Insights({ posts }: InsightsProps) {
  const ref = useRef<HTMLDivElement>(null);
  useSectionReveal(ref);
  const { dir } = useTranslation();
  const arrowClass = dir === 'rtl' ? '' : 'scale-x-[-1]';

  const visiblePosts = (posts.length > 0 ? posts : fallbackPosts).slice(0, 3);
  const featuredPost = visiblePosts[0];
  const secondaryPosts = visiblePosts.slice(1);

  return (
    <section id="insights" className="relative overflow-hidden bg-white py-12 dark:bg-navy-950 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(18,169,217,0.12),transparent_32%),linear-gradient(to_bottom,#ffffff,rgba(247,251,253,0.82))] dark:bg-[radial-gradient(circle_at_top_left,rgba(18,169,217,0.12),transparent_30%),linear-gradient(to_bottom,#020617,#071827)]" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-10 grid gap-5 lg:mb-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div className="space-y-4 text-start">
            <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              {translateMessage('Blog')}
            </div>
            <h2 className="text-2xl font-bold leading-[1.34] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.35rem]">
              {translateMessage('Articles that help you')} <span className="gradient-text">{translateMessage('decide with confidence')}</span>
            </h2>
          </div>
          <div className="text-start">
            <p className="max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              {translateMessage('We write about planning, cost, user experience, and launch so you start your project with clearer decisions.')}
            </p>
            <Link href="/blogs" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary hover:text-primary-dark">
              {translateMessage('All Articles')}
              <ArrowUpLeft size={16} className={arrowClass} />
            </Link>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          {featuredPost ? (
            <Link
              href={`/blogs/${featuredPost.slug}`}
              className="reveal group relative overflow-hidden rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-2xl shadow-cyan-950/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-glow)] sm:p-8 lg:rounded-[2rem]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(18,169,217,0.35),transparent_36%)]" />
              <div className="relative">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{translateMessage(featuredPost.category || 'Featured Article')}</span>
                <h3 className="mt-6 max-w-2xl text-2xl font-bold leading-[1.36] text-white transition-colors group-hover:text-primary sm:text-3xl">
                  {translateMessage(featuredPost.title)}
                </h3>
                <p className="mt-4 max-w-2xl leading-relaxed text-slate-300">{translateMessage(featuredPost.excerpt)}</p>
                <div className="mt-10 grid grid-cols-2 gap-3 sm:max-w-lg">
                  {['Scope Clarity', 'Lower Risk', 'Faster Decision', 'First Plan'].map((label) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/7 p-4 text-sm font-bold text-slate-200">
                      {translateMessage(label)}
                    </div>
                  ))}
                </div>
                <p className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary">
                  {translateMessage('Read Article')}
                  <ArrowUpLeft size={16} className={arrowClass} />
                </p>
              </div>
            </Link>
          ) : null}

          <div className="grid gap-5">
            {secondaryPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blogs/${post.slug}`}
                className="reveal group rounded-[1.5rem] border border-cyan-950/10 bg-slate-50/80 p-6 transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:bg-white hover:shadow-[var(--shadow-glow)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/8"
                style={{ transitionDelay: `${(index + 1) * 0.08}s` }}
              >
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{translateMessage(post.category || 'Blog')}</span>
                <h3 className="mt-5 text-xl font-bold leading-[1.36] text-slate-950 transition-colors group-hover:text-primary dark:text-white">{translateMessage(post.title)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{translateMessage(post.excerpt)}</p>
                <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                  {translateMessage('Read Article')}
                  <ArrowUpLeft size={16} className={arrowClass} />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
