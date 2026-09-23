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
import BlogPager from '@/features/blog/components/blog-pager';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('blog', await getServerLanguage());
}

type BlogsPageProps = { searchParams: Promise<{ page?: string }> };

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const [{ items: blogPosts, pagination }, categories] = await Promise.all([
    fetchPublicBlogs(language, { page }),
    fetchPublicBlogCategories(language),
  ]);
  // The featured/hero slot is only shown on page 1, so pagination hands back consistent page sizes.
  const featuredPost = page === 1 ? blogPosts[0] : undefined;
  const remainingPosts = page === 1 ? blogPosts.slice(1) : blogPosts;

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
          tt('Raiyan Soft Blog Articles'),
        )}
      />

      <PageHero
        eyebrow={tt('Blog')}
        title={tt('Practical ideas before you build your digital product')}
        description={tt('Short articles to help you understand scope, cost, user experience, and how to launch with confidence.')}
        breadcrumbs={[{ label: tt('Home'), href: '/' }, { label: tt('Blog'), href: '/blogs' }]}
        actions={[{ label: tt('Get a Quote'), href: '/quote' }, { label: tt('Book a Consultation'), href: '/consultation', variant: 'secondary' }]}
      />

      <SectionShell>
        {categories.length > 0 ? (
          <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/blogs/categories" className="rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
                {tt('All Categories')}
              </Link>
              {categories.map((category) => (
                <Link key={category.slug} href={`/blogs/categories/${category.slug}`} className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm font-bold text-[var(--text)] transition hover:border-primary/30 hover:text-primary">
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {featuredPost ? (
          <Link
            href={`/blogs/${featuredPost.slug}`}
            className="group grid gap-6 rounded-xl border border-[var(--border)] bg-[var(--navy)] p-6 text-white shadow-xl shadow-cyan-950/10 transition hover:-translate-y-1 hover:border-primary/40 md:grid-cols-[1.1fr_0.9fr] md:p-8"
          >
            <div>
              <p className="text-sm font-black text-cyan-300">{featuredPost.category?.title || tt('Featured Article')}</p>
              <h2 className="mt-4 text-2xl font-black leading-snug sm:text-3xl">{featuredPost.title}</h2>
              <p className="mt-4 line-clamp-4 text-sm leading-8 text-slate-300 sm:text-base">{featuredPost.excerpt}</p>
              <p className="mt-6 text-sm font-black text-cyan-300 transition group-hover:text-white">{tt('Read Article')}</p>
            </div>
            <div className="flex min-h-52 items-end rounded-xl bg-[radial-gradient(circle_at_top_left,rgb(var(--primary-glow-rgb) / 0.35),transparent_42%),linear-gradient(135deg,#102033,#07111f)] p-5">
              <div className="grid grid-cols-2 gap-3 text-sm font-bold text-white">
                {['Clearer planning', 'Faster decisions', 'Lower risk', 'Calmer launch'].map((item) => (
                  <span key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">{tt(item)}</span>
                ))}
              </div>
            </div>
          </Link>
        ) : null}

        <div className="mt-8 text-center">
          <h2 className="text-lg font-black text-[var(--text)]">{tt('Recent Articles')}</h2>
          <Link href="/blogs/categories" className="mt-2 inline-block text-sm font-black text-primary hover:text-primary-dark">
            {tt('Browse Categories')}
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {remainingPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className="group flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30"
            >
              <p className="text-xs font-black text-primary">{post.category?.title || tt('Blog')}</p>
              <h2 className="mt-3 text-xl font-black leading-snug text-[var(--text)] transition group-hover:text-primary">{post.title}</h2>
              <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--text-muted)]">{post.excerpt}</p>
              <p className="mt-auto pt-5 text-sm font-black text-primary">{tt('Read Article')}</p>
            </Link>
          ))}
        </div>
        <BlogPager pagination={pagination} basePath="/blogs" language={language} />
      </SectionShell>

      <CtaBlock title={tt('Want to turn the idea into an execution plan?')} description={tt("Share your project context and we'll suggest the next practical step.")} />
    </PublicLayout>
  );
}
