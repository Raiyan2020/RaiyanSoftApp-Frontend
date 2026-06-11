import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PublicLayout from '@/components/public/public-layout';
import PageHero from '@/components/public/page-hero';
import SectionShell from '@/components/public/section-shell';
import CtaBlock from '@/components/public/cta-block';
import JsonLd from '@/components/public/json-ld';
import { createArticleJsonLd, createBreadcrumbJsonLd, createPublicMetadata, getCanonicalUrl } from '@/lib/site';
import { fetchPublicBlog, fetchPublicBlogs } from '@/features/blog/services/blog-api';

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await fetchPublicBlogs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPublicBlog(slug);

  if (!post) {
    return createPublicMetadata({
      title: 'المقال غير موجود',
      description: 'لم نتمكن من العثور على هذا المقال في مدونة ريان سوفت.',
      path: '/blogs',
    });
  }

  return createPublicMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blogs/${post.slug}`,
    type: 'article',
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchPublicBlog(slug);
  if (!post) notFound();

  const relatedPosts = [
    ...(post.related_blogs || []),
  ].slice(0, 3);
  const paragraphs = post.content ? post.content.split('\n').map((line) => line.trim()).filter(Boolean) : [post.excerpt];
  const categoryHref = post.category ? `/blogs/categories/${post.category.slug}` : '/blogs';
  const articlePost = { ...post, category: post.category?.title };

  return (
    <PublicLayout seo={{ title: post.title, description: post.excerpt, path: `/blogs/${post.slug}` }}>
      <JsonLd id={`article-schema-${post.slug}`} data={createArticleJsonLd(articlePost)} />
      <JsonLd
        id={`article-breadcrumbs-${post.slug}`}
        data={createBreadcrumbJsonLd([
          { name: 'الرئيسية', url: getCanonicalUrl('/') },
          { name: 'المدونة', url: getCanonicalUrl('/blogs') },
          { name: post.title, url: getCanonicalUrl(`/blogs/${post.slug}`) },
        ])}
      />

      <PageHero
        eyebrow={post.category?.title || 'المدونة'}
        title={post.title}
        description={post.excerpt}
        breadcrumbs={[
          { label: 'الرئيسية', href: '/' },
          { label: 'المدونة', href: '/blogs' },
          ...(post.category ? [{ label: post.category.title, href: categoryHref }] : []),
          { label: post.title, href: `/blogs/${post.slug}` },
        ]}
      />

      <SectionShell>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <article className="rounded-lg border border-cyan-950/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
            {post.category ? (
              <Link href={categoryHref} className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {post.category.title}
              </Link>
            ) : null}
            <div className="prose prose-slate max-w-none dark:prose-invert prose-p:leading-9 prose-p:text-slate-700 dark:prose-p:text-slate-200">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <aside className="rounded-lg border border-cyan-950/10 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-black text-slate-950 dark:text-white">مقالات ذات صلة</p>
            <div className="mt-4 space-y-3">
              {relatedPosts.length > 0 ? (
                relatedPosts.map((item) => (
                  <Link key={item.slug} href={`/blogs/${item.slug}`} className="block rounded-lg bg-white p-4 text-sm font-bold leading-7 text-slate-700 transition hover:text-primary dark:bg-white/5 dark:text-slate-200">
                    {item.title}
                  </Link>
                ))
              ) : (
                <Link href="/blogs" className="block rounded-lg bg-white p-4 text-sm font-bold text-primary dark:bg-white/5">
                  العودة إلى كل المقالات
                </Link>
              )}
            </div>
          </aside>
        </div>
      </SectionShell>

      <CtaBlock title="تحتاج مساعدة في قرار المنتج؟" description="اكتب لنا عن فكرتك وسنساعدك في ترتيب النطاق والخطوة القادمة." />
    </PublicLayout>
  );
}
