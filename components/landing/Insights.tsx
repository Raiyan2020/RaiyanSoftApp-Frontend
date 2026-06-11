'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ArrowUpLeft } from 'lucide-react';
import { useSectionReveal } from './use-section-reveal';

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
    title: 'كيف تحدد تكلفة منتجك الرقمي قبل البدء؟',
    category: 'إدارة المنتج',
    excerpt: 'إطار مبسط لفهم نطاق المشروع والعوامل التي تؤثر في التكلفة والمدة قبل أول اجتماع.',
  },
];

export default function Insights({ posts }: InsightsProps) {
  const ref = useRef<HTMLDivElement>(null);
  useSectionReveal(ref);

  const visiblePosts = (posts.length > 0 ? posts : fallbackPosts).slice(0, 3);
  const featuredPost = visiblePosts[0];
  const secondaryPosts = visiblePosts.slice(1);

  return (
    <section id="insights" className="relative overflow-hidden bg-white py-12 dark:bg-navy-950 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(18,169,217,0.12),transparent_32%),linear-gradient(to_bottom,#ffffff,rgba(247,251,253,0.82))] dark:bg-[radial-gradient(circle_at_top_left,rgba(18,169,217,0.12),transparent_30%),linear-gradient(to_bottom,#020617,#071827)]" />

      <div ref={ref} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-10 grid gap-5 lg:mb-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div className="space-y-4 text-right">
            <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              المدونة
            </div>
            <h2 className="text-2xl font-bold leading-[1.34] text-slate-950 dark:text-white sm:text-3xl lg:text-[2.35rem]">
              مقالات تساعدك <span className="gradient-text">تقرر بثقة</span>
            </h2>
          </div>
          <div className="text-right">
            <p className="max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              نكتب عن التخطيط، التكلفة، تجربة المستخدم، والإطلاق حتى تبدأ مشروعك بقرارات أوضح.
            </p>
            <Link href="/blogs" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary hover:text-primary-dark">
              كل المقالات
              <ArrowUpLeft size={16} />
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
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{featuredPost.category || 'مقال مميز'}</span>
                <h3 className="mt-6 max-w-2xl text-2xl font-bold leading-[1.36] text-white transition-colors group-hover:text-primary sm:text-3xl">
                  {featuredPost.title}
                </h3>
                <p className="mt-4 max-w-2xl leading-relaxed text-slate-300">{featuredPost.excerpt}</p>
                <div className="mt-10 grid grid-cols-2 gap-3 sm:max-w-lg">
                  {['وضوح النطاق', 'خفض المخاطر', 'قرار أسرع', 'خطة أولى'].map((label) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/7 p-4 text-sm font-bold text-slate-200">
                      {label}
                    </div>
                  ))}
                </div>
                <p className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary">
                  قراءة المقال
                  <ArrowUpLeft size={16} />
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
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{post.category || 'المدونة'}</span>
                <h3 className="mt-5 text-xl font-bold leading-[1.36] text-slate-950 transition-colors group-hover:text-primary dark:text-white">{post.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{post.excerpt}</p>
                <p className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                  قراءة المقال
                  <ArrowUpLeft size={16} />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
