import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';
import { useAdminProjectTypes } from '@/features/admin-project-types';
import Input from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeadStatusFilter } from '../hooks/use-admin-leads';

interface LeadsFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: LeadStatusFilter;
  setStatusFilter: (val: LeadStatusFilter) => void;
  dateFrom: string;
  setDateFrom: (val: string) => void;
  dateTo: string;
  setDateTo: (val: string) => void;
  typeFilter: string;
  setTypeFilter: (val: string) => void;
}

const fieldClass = 'app-input min-h-11 w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors';

const TYPE_FILTER_ALL = '__all__';

const STATUS_OPTIONS: { value: LeadStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'rejected', label: 'Rejected' },
];

export default function LeadsFilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  typeFilter,
  setTypeFilter,
}: LeadsFilterBarProps) {
  const { t, language } = useTranslation();
  const { types: projectTypes } = useAdminProjectTypes();
  const activeTypes = projectTypes.filter((type) => type.active);

  return (
    <div className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-lg flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin.leads.search_placeholder')}
            icon={<Search size={18} />}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {STATUS_OPTIONS.map((status) => (
            <button
              type="button"
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize border transition-all whitespace-nowrap ${
                statusFilter === status.value
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border)] hover:text-[var(--text)]'
              }`}
            >
              {t(`admin.leads.filter.${status.value}`)}
            </button>
          ))}
        </div>
      </div>
      {/* Visible labels: the two date fields were adjacent, identically
          styled boxes showing the same empty date mask, so nothing on screen
          said which one was "from" and which was "to". */}
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex min-w-0 flex-col gap-1">
          <span className="text-xs font-bold text-[var(--text-muted)]">{t('admin.leads.date_from')}</span>
          <input
            type="date"
            lang={language}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="flex min-w-0 flex-col gap-1">
          <span className="text-xs font-bold text-[var(--text-muted)]">{t('admin.leads.date_to')}</span>
          <input
            type="date"
            lang={language}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="flex min-w-0 flex-col gap-1">
          <span className="text-xs font-bold text-[var(--text-muted)]">{t('admin.leads.project_type')}</span>
          <Select value={typeFilter || TYPE_FILTER_ALL} onValueChange={(value) => setTypeFilter(value === TYPE_FILTER_ALL ? '' : value)}>
            <SelectTrigger className="min-h-11" aria-label={t('admin.leads.project_type')}>
              <SelectValue placeholder={t('admin.leads.all_types')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TYPE_FILTER_ALL}>{t('admin.leads.all_types')}</SelectItem>
              {activeTypes.map((type) => (
                <SelectItem key={type.id} value={type.slug || type.name}>
                  {(language === 'ar' && type.nameAr) || type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>
    </div>
  );
}
