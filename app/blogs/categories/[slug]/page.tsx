import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PublicLayout from '@/components/public/public-layout';
import PageHero from '@/components/public/page-hero';
import SectionShell from '@/components/public/section-shell';
import JsonLd from '@/components/public/json-ld';
import { createCollectionPageJsonLd, createItemListJsonLd, getCanonicalUrl, createPublicMetadata } from '@/lib/site';
import { fetchPublicBlogCategory, fetchPublicBlogCategoryBlogs, fetchPublicBlogCategories } from '@/features/blog/services/blog-api';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export async function generateStaticParams() {
  const categories = await fetchPublicBlogCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const language = await getServerLanguage();
  const category = await fetchPublicBlogCategory(slug, language);

  if (!category) {
    return createPublicMetadata({
      title: translateMessage('Category Not Found', language),
      description: translateMessage('Category Not Found', language),
      path: '/blogs/categories',
    });
  }

  return createPublicMetadata({
    title: category.title,
    description: translateMessage('Articles in the {category} category', language).replace('{category}', category.title),
    path: `/blogs/categories/${slug}`,
  });
}

export default async function BlogCategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  const category = await fetchPublicBlogCategory(slug, language);
  const categoryPosts = await fetchPublicBlogCategoryBlogs(slug, language);
  const categoryTitle = category?.title || '';
  const articlesInCategory = tt('Articles in the {category} category').replace('{category}', categoryTitle);

  if (!category) notFound();

  return (
    <PublicLayout seo={{ title: categoryTitle, description: articlesInCategory, path: `/blogs/categories/${slug}` }}>
      <JsonLd id={`blog-category-collection-${slug}`} data={createCollectionPageJsonLd({ title: categoryTitle, description: articlesInCategory, path: `/blogs/categories/${slug}` })} />
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
        eyebrow={tt('Blog')}
        title={category.title}
        description={tt('Articles related to the {category} category.').replace('{category}', category.title)}
        breadcrumbs={[
          { label: tt('Home'), href: '/' },
          { label: tt('Blog'), href: '/blogs' },
          { label: tt('Categories'), href: '/blogs/categories' },
          { label: category.title, href: `/blogs/categories/${slug}` },
        ]}
      />

      <SectionShell title={tt('Articles')} description={tt('All articles related to this category.')}>
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
