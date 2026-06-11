import type { Metadata } from 'next';
import Link from 'next/link';
import PublicLayout from '@/components/public/public-layout';
import PageHero from '@/components/public/page-hero';
import SectionShell from '@/components/public/section-shell';
import JsonLd from '@/components/public/json-ld';
import { createCollectionPageJsonLd, createItemListJsonLd, getCanonicalUrl, createPublicMetadata } from '@/lib/site';
import { fetchPublicBlogCategories, fetchPublicBlogs } from '@/features/blog/services/blog-api';

export const metadata: Metadata = createPublicMetadata({
  title: 'تصنيفات المدونة',
  description: 'استعرض مقالات ريان سوفت بحسب التصنيف للعثور على المحتوى الأقرب لمجالك ومرحلة مشروعك.',
  path: '/blogs/categories',
});

export default async function BlogCategoriesPage() {
  const categories = await fetchPublicBlogCategories();
  const posts = await fetchPublicBlogs();
  const categoriesWithCount = categories.map((category) => ({
    ...category,
    count: posts.filter((post) => post.category?.slug === category.slug || post.category?.id === category.id).length,
  }));

  return (
    <PublicLayout seo={{ title: 'المدونة', description: 'مقالات ريان سوفت', path: '/blogs/categories' }}>
      <JsonLd id="blog-categories-collection-schema" data={createCollectionPageJsonLd({ title: 'تصنيفات المدونة', description: 'استعرض المقالات بحسب التصنيف.', path: '/blogs/categories' })} />
      <JsonLd
        id="blog-categories-list-schema"
        data={createItemListJsonLd(
          categoriesWithCount.map((category) => ({
            name: category.title,
            url: getCanonicalUrl(`/blogs/categories/${category.slug}`),
            description: `${category.count} مقالة`,
          })),
          'تصنيفات المدونة',
        )}
      />

      <PageHero
        eyebrow="المدونة"
        title="تصنيفات المقالات"
        description="تصفح المقالات بحسب الموضوع للوصول بسرعة إلى ما يهمك."
        breadcrumbs={[{ label: 'الرئيسية', href: '/' }, { label: 'المدونة', href: '/blogs' }, { label: 'التصنيفات', href: '/blogs/categories' }]}
      />

      <SectionShell title="كل التصنيفات" description="اختر تصنيفاً لعرض المقالات المرتبطة به.">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categoriesWithCount.map((category) => (
            <Link
              key={category.slug}
              href={`/blogs/categories/${category.slug}`}
              className="rounded-2xl border border-cyan-950/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 dark:border-white/10 dark:bg-white/5"
            >
              <p className="text-sm font-black text-primary">{category.count} مقالة</p>
              <h2 className="mt-3 text-xl font-black text-slate-950 dark:text-white">{category.title}</h2>
            </Link>
          ))}
        </div>
      </SectionShell>
    </PublicLayout>
  );
}
