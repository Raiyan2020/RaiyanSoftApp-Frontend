import type { Metadata } from 'next';
import PublicSimplePage from '@/components/public/public-page-section';
import { BasicContentCard } from '@/components/public/content-cards';
import { getPublicWebsiteData } from '@/lib/websiteContentPublic';
import { createPublicMetadata } from '@/lib/site';

export const metadata: Metadata = createPublicMetadata({
  title: 'المدونة',
  description: 'مقالات عملية حول التخطيط للمنتجات الرقمية وتجربة المستخدم والتطوير.',
  path: '/blog',
});

type PublicBlogPost = { slug: string; title: string; excerpt: string };

export default async function BlogPage() {
  const blogPosts = await getPublicWebsiteData<PublicBlogPost>('blog');

  return (
    <PublicSimplePage eyebrow="المدونة" title="أفكار تساعدك قبل بناء المنتج" description="محتوى مبسط لاتخاذ قرارات أوضح حول التكلفة، النطاق، والتجربة.">
      <div className="grid gap-4 md:grid-cols-2">
        {blogPosts.map((post) => (
          <BasicContentCard key={post.slug} title={post.title} description={post.excerpt} href={`/blog/${post.slug}`} label="قراءة المقال" />
        ))}
      </div>
    </PublicSimplePage>
  );
}
