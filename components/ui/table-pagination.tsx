'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';
import type { PaginationMeta } from '@/lib/api-service';

type TablePaginationProps = {
  pagination: PaginationMeta | null;
  onPageChange: (page: number) => void;
  loading?: boolean;
  className?: string;
};

/**
 * Shared footer for paginated admin/user lists: "Showing x - y of z" plus
 * prev/next. Renders nothing until the backend returned pagination meta with
 * at least one record, so single-page lists still show their range.
 */
export default function TablePagination({ pagination, onPageChange, loading = false, className = '' }: TablePaginationProps) {
  const { t } = useTranslation();
  if (!pagination || pagination.total <= 0) return null;

  const { current_page: current, last_page: last, per_page: perPage, total } = pagination;
  const from = (current - 1) * perPage + 1;
  const to = Math.min(current * perPage, total);
  const goTo = (page: number) => onPageChange(Math.min(Math.max(1, page), last));

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--text-muted)] ${className}`}>
      <span aria-live="polite">
        {t('pagination.range')
          .replace('{from}', String(Math.min(from, total)))
          .replace('{to}', String(to))
          .replace('{total}', String(total))}
      </span>
      {last > 1 ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={current <= 1 || loading}
            onClick={() => goTo(current - 1)}
            aria-label={t('pagination.previous')}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] disabled:opacity-40"
          >
            <ChevronLeft size={16} className="rtl:rotate-180" />
          </button>
          <span className="tabular-nums">
            {t('pagination.page_of').replace('{current}', String(current)).replace('{last}', String(last))}
          </span>
          <button
            type="button"
            disabled={current >= last || loading}
            onClick={() => goTo(current + 1)}
            aria-label={t('pagination.next')}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] disabled:opacity-40"
          >
            <ChevronRight size={16} className="rtl:rotate-180" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
