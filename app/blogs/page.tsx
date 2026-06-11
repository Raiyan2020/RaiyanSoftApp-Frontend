import type { Metadata } from 'next';
import Link from 'next/link';
import PublicLayout from '@/components/public/public-layout';
import PageHero from '@/components/public/page-hero';
import SectionShell from '@/components/public/section-shell';
import CtaBlock from '@/components/public/cta-block';
import JsonLd from '@/components/public/json-ld';
import { getPageMetadata, pageSeo } from '@/lib/page-seo';
import { createCollectionPageJsonLd, createItemListJsonLd, getCanonicalUrl } from '@/lib/site';
import { fetchPublicBlogs, fetchPublicBlogCategories } from '@/features/blog/services/blog-api';

export const metadata: Metadata = getPageMetadata('blog');

export default async function BlogsPage() {
  const blogPosts = await fetchPublicBlogs();
  const categories = await fetchPublicBlogCategories();
  const featuredPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1);

  return (
    <PublicLayout seo={pageSeo.blog}>
      <JsonLd id="blogs-collection-schema" data={createCollectionPageJsonLd(pageSeo.blog)} />
      <JsonLd
        id="blogs-list-schema"
        data={createItemListJsonLd(
          blogPosts.map((post) => ({
            name: post.title,
            description: post.excerpt,
            url: getCanonicalUrl(`/blogs/${post.slug}`),
          })),
          'مقالات ريان سوفت',
        )}
      />

      <PageHero
        eyebrow="المدونة"
        title="أفكار عملية قبل بناء منتجك الرقمي"
        description="مقالات مختصرة تساعدك على فهم النطاق، التكلفة، تجربة المستخدم، وخطوات الإطلاق بثقة."
        breadcrumbs={[{ label: 'الرئيسية', href: '/' }, { label: 'المدونة', href: '/blogs' }]}
        actions={[{ label: 'اطلب عرض سعر', href: '/quote' }, { label: 'احجز استشارة', href: '/consultation', variant: 'secondary' }]}
      />

      <SectionShell>
        {categories.length > 0 ? (
          <div className="mb-8 rounded-2xl border border-cyan-950/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/blogs/categories" className="rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
                جميع التصنيفات
              </Link>
              {categories.map((category) => (
                <Link key={category.slug} href={`/blogs/categories/${category.slug}`} className="rounded-full border border-cyan-950/10 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-primary/30 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {featuredPost ? (
          <Link
            href={`/blogs/${featuredPost.slug}`}
            className="group grid gap-6 rounded-lg border border-cyan-950/10 bg-slate-950 p-6 text-white shadow-xl shadow-cyan-950/10 transition hover:-translate-y-1 hover:border-primary/40 md:grid-cols-[1.1fr_0.9fr] md:p-8"
          >
            <div>
              <p className="text-sm font-black text-primary">{featuredPost.category?.title || 'مقال مميز'}</p>
              <h2 className="mt-4 text-2xl font-black leading-snug sm:text-3xl">{featuredPost.title}</h2>
              <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">{featuredPost.excerpt}</p>
              <p className="mt-6 text-sm font-black text-primary transition group-hover:text-cyan-300">قراءة المقال</p>
            </div>
            <div className="flex min-h-52 items-end rounded-lg bg-[radial-gradient(circle_at_top_left,rgba(18,169,217,0.35),transparent_42%),linear-gradient(135deg,#102033,#07111f)] p-5">
              <div className="grid grid-cols-2 gap-3 text-sm font-bold text-slate-200">
                {['تخطيط أوضح', 'قرار أسرع', 'مخاطر أقل', 'إطلاق أهدأ'].map((item) => (
                  <span key={item} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">{item}</span>
                ))}
              </div>
            </div>
          </Link>
        ) : null}

        <div className="mt-8 flex items-center justify-between gap-3">
          <h2 className="text-lg font-black text-slate-950 dark:text-white">المقالات الأخيرة</h2>
          <Link href="/blogs/categories" className="text-sm font-black text-primary hover:text-primary-dark">
            تصفح التصنيفات
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(featuredPost ? remainingPosts : blogPosts).map((post) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className="group flex h-full flex-col rounded-lg border border-cyan-950/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 dark:border-white/10 dark:bg-white/5"
            >
              <p className="text-xs font-black text-primary">{post.category?.title || 'المدونة'}</p>
              <h2 className="mt-3 text-xl font-black leading-snug text-slate-950 transition group-hover:text-primary dark:text-white">{post.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-slate-600 dark:text-slate-300">{post.excerpt}</p>
              <p className="mt-5 text-sm font-black text-primary">قراءة المقال</p>
            </Link>
          ))}
        </div>
      </SectionShell>

      <CtaBlock title="تريد تحويل الفكرة إلى خطة تنفيذ؟" description="شاركنا سياق مشروعك وسنقترح عليك الخطوة العملية التالية." />
    </PublicLayout>
  );
}
