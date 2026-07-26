import type { Metadata } from 'next';
import Link from 'next/link';
import PublicLayout from '@/components/public/public-layout';
import PageHero from '@/components/public/page-hero';
import SectionShell from '@/components/public/section-shell';
import JsonLd from '@/components/public/json-ld';
import { createCollectionPageJsonLd, createItemListJsonLd, getCanonicalUrl, createPublicMetadata } from '@/lib/site';
import { fetchPublicBlogCategories, fetchPublicBlogs } from '@/features/blog/services/blog-api';
import { translateMessage } from '@/lib/i18n-utils';
import { getServerLanguage } from '@/lib/language.server';

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  return createPublicMetadata({
    title: translateMessage('Blog Categories', language),
    description: translateMessage(
      'Browse Raiyan Soft articles by category to find the content closest to your field and project stage.',
      language,
    ),
    path: '/blogs/categories',
  });
}

export default async function BlogCategoriesPage() {
  const language = await getServerLanguage();
  const tt = (message: string) => translateMessage(message, language);
  const categories = await fetchPublicBlogCategories(language);
  const posts = await fetchPublicBlogs(language);
  const categoriesWithCount = categories.map((category) => ({
    ...category,
    count: posts.filter((post) => post.category?.slug === category.slug || post.category?.id === category.id).length,
  }));
  const articleCount = (count: number) => tt('{count} articles').replace('{count}', String(count));

  return (
    <PublicLayout seo={{ title: tt('Blog'), description: tt('Raiyan Soft Blog Articles'), path: '/blogs/categories' }}>
      <JsonLd id="blog-categories-collection-schema" data={createCollectionPageJsonLd({ title: tt('Blog Categories'), description: tt('Browse articles by category.'), path: '/blogs/categories' })} />
      <JsonLd
        id="blog-categories-list-schema"
        data={createItemListJsonLd(
          categoriesWithCount.map((category) => ({
            name: category.title,
            url: getCanonicalUrl(`/blogs/categories/${category.slug}`),
            description: articleCount(category.count),
          })),
          tt('Blog Categories'),
        )}
      />

      <PageHero
        eyebrow={tt('Blog')}
        title={tt('Article Categories')}
        description={tt('Browse articles by topic to quickly reach what matters to you.')}
        breadcrumbs={[{ label: tt('Home'), href: '/' }, { label: tt('Blog'), href: '/blogs' }, { label: tt('Categories'), href: '/blogs/categories' }]}
      />

      <SectionShell title={tt('All Blog Categories')} description={tt('Choose a category to view its related articles.')}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categoriesWithCount.map((category) => (
            <Link
              key={category.slug}
              href={`/blogs/categories/${category.slug}`}
              className="rounded-2xl border border-cyan-950/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 dark:border-white/10 dark:bg-white/5"
            >
              <p className="text-sm font-black text-primary">{articleCount(category.count)}</p>
              <h2 className="mt-3 text-xl font-black text-slate-950 dark:text-white">{category.title}</h2>
            </Link>
          ))}
        </div>
      </SectionShell>
    </PublicLayout>
  );
}
