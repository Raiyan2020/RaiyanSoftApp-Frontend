import Link from 'next/link';
import type { PaginationMeta } from '@/lib/api-service';
import { translateMessage } from '@/lib/i18n-utils';
import type { AppLanguage } from '@/lib/language';

type BlogPagerProps = {
  pagination: PaginationMeta | null;
  /** Base path the pager links back to, e.g. `/blogs` or `/blogs/categories/design`. */
  basePath: string;
  language: AppLanguage;
};

/**
 * `?page=` link pager for server-rendered public blog listings. Kept as
 * plain `<Link>`s (no client state) so the pages stay statically
 * cacheable/SEO-friendly; each page is its own crawlable, revalidatable URL.
 */
export default function BlogPager({ pagination, basePath, language }: BlogPagerProps) {
  if (!pagination || pagination.last_page <= 1) return null;
  const tt = (message: string) => translateMessage(message, language);
  const { current_page: current, last_page: last } = pagination;
  const hrefFor = (page: number) => (page <= 1 ? basePath : `${basePath}?page=${page}`);

  return (
    <nav aria-label={tt('Pagination')} className="mt-10 flex items-center justify-center gap-3">
      {current > 1 ? (
        <Link href={hrefFor(current - 1)} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-bold text-[var(--text)] hover:border-primary/30 hover:text-primary">
          {tt('Previous')}
        </Link>
      ) : null}
      <span className="text-sm font-bold text-[var(--text-muted)]">
        {tt('Page {current} of {last}').replace('{current}', String(current)).replace('{last}', String(last))}
      </span>
      {current < last ? (
        <Link href={hrefFor(current + 1)} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-bold text-[var(--text)] hover:border-primary/30 hover:text-primary">
          {tt('Next')}
        </Link>
      ) : null}
    </nav>
  );
}
