import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PublicLayout from '@/components/public/public-layout';
import PageHero from '@/components/public/page-hero';
import SectionShell from '@/components/public/section-shell';
import JsonLd from '@/components/public/json-ld';
import { createCollectionPageJsonLd, createItemListJsonLd, getCanonicalUrl, createPublicMetadata } from '@/lib/site';
import { fetchPublicBlogCategory, fetchPublicBlogCategoryBlogs, fetchPublicBlogCategories } from '@/features/blog/services/blog-api';

export async function generateStaticParams() {
  const categories = await fetchPublicBlogCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const category = await fetchPublicBlogCategory(slug);

  if (!category) {
    return createPublicMetadata({ title: 'التصنيف غير موجود', description: 'التصنيف غير موجود', path: '/blogs/categories' });
  }

  return createPublicMetadata({
    title: category.title,
    description: `مقالات ضمن تصنيف ${category.title}`,
    path: `/blogs/categories/${slug}`,
  });
}

export default async function BlogCategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const category = await fetchPublicBlogCategory(slug);
  const categoryPosts = await fetchPublicBlogCategoryBlogs(slug);
  const categoryTitle = category?.title || '';

  if (!category) notFound();

  return (
    <PublicLayout seo={{ title: categoryTitle, description: `مقالات ضمن تصنيف ${categoryTitle}`, path: `/blogs/categories/${slug}` }}>
      <JsonLd id={`blog-category-collection-${slug}`} data={createCollectionPageJsonLd({ title: categoryTitle, description: `مقالات ضمن تصنيف ${categoryTitle}`, path: `/blogs/categories/${slug}` })} />
      <JsonLd
        id={`blog-category-list-${slug}`}
        data={createItemListJsonLd(
          categoryPosts.map((post) => ({
            name: post.title,
            description: post.excerpt,
            url: getCanonicalUrl(`/blogs/${post.slug}`),
          })),
          categoryTitle,
        )}
      />

      <PageHero
        eyebrow="المدونة"
        title={category.title}
        description={`مقالات مرتبطة بتصنيف ${category.title}.`}
        breadcrumbs={[
          { label: 'الرئيسية', href: '/' },
          { label: 'المدونة', href: '/blogs' },
          { label: 'التصنيفات', href: '/blogs/categories' },
          { label: category.title, href: `/blogs/categories/${slug}` },
        ]}
      />

      <SectionShell title="المقالات" description="كل المقالات المرتبطة بهذا التصنيف.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categoryPosts.map((post) => (
            <Link
              key={post.slug}
            href={`/blogs/${post.slug}`}
            className="rounded-2xl border border-cyan-950/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 dark:border-white/10 dark:bg-white/5"
          >
              <p className="text-xs font-black text-primary">{post.category?.title || category.title}</p>
              <h2 className="mt-3 text-xl font-black text-slate-950 dark:text-white">{post.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </SectionShell>
    </PublicLayout>
  );
}
