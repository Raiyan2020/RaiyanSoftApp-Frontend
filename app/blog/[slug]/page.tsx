import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PublicLayout from '@/components/public/public-layout';
import PageHero from '@/components/public/page-hero';
import SectionShell from '@/components/public/section-shell';
import CtaBlock from '@/components/public/cta-block';
import JsonLd from '@/components/public/json-ld';
import { blogPosts } from '@/lib/public-content';
import { createArticleJsonLd, createBreadcrumbJsonLd, createPublicMetadata, getCanonicalUrl } from '@/lib/site';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';

type PageProps = { params: Promise<{ slug: string }> };
type PublicBlogPost = { slug: string; title: string; excerpt: string; category: string; body?: string };

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

async function getBlogPosts() {
  return getPublicWebsiteData<PublicBlogPost>('blog');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((item) => item.slug === slug);
  if (!post) return createPublicMetadata({ title: 'Post not found', path: '/blog' });
  return createPublicMetadata({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}`, type: 'article' });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();

  const paragraphs = post.body ? post.body.split('\n').map((line) => line.trim()).filter(Boolean) : [];

  return (
    <PublicLayout>
      <JsonLd id={`article-schema-${post.slug}`} data={createArticleJsonLd(post)} />
      <JsonLd
        id={`article-breadcrumbs-${post.slug}`}
        data={createBreadcrumbJsonLd([
          { name: 'Blog', url: getCanonicalUrl('/blog') },
          { name: post.title, url: getCanonicalUrl(`/blog/${post.slug}`) },
        ])}
      />
      <PageHero
        eyebrow={post.category || 'Blog'}
        title={post.title}
        description={post.excerpt}
        breadcrumbs={[{ label: 'Blog', href: '/blog' }, { label: post.title, href: `/blog/${post.slug}` }]}
      />
      <SectionShell>
        <article className="mx-auto max-w-3xl space-y-6 text-base leading-9 text-slate-700 dark:text-slate-200">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          ) : (
            <p>{post.excerpt}</p>
          )}
        </article>
      </SectionShell>
      <CtaBlock title="Need a clearer project scope?" description="Send us your idea and we will help you shape the first practical version." />
    </PublicLayout>
  );
}
