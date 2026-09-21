import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';
import { useAdminProjectTypes } from '@/features/admin-project-types';
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
  const { t } = useTranslation();
  const { types: projectTypes } = useAdminProjectTypes();
  const activeTypes = projectTypes.filter((type) => type.active);

  return (
    <div className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-lg flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 text-[var(--text-muted)] start-3" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin.leads.search_placeholder')}
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-2.5 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary transition-colors ps-10 pe-4"
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
                  : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--surface-3)]'
              }`}
            >
              {t(`admin.leads.filter.${status.value}`)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          aria-label={t('admin.leads.date_from')}
          className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-2.5 px-3 text-[var(--text)] focus:outline-none focus:border-primary transition-colors"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          aria-label={t('admin.leads.date_to')}
          className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-2.5 px-3 text-[var(--text)] focus:outline-none focus:border-primary transition-colors"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          aria-label={t('admin.leads.project_type')}
          className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-2.5 px-3 text-[var(--text)] focus:outline-none focus:border-primary transition-colors"
        >
          <option value="">{t('admin.leads.all_types')}</option>
          {activeTypes.map((type) => (
            <option key={type.id} value={type.slug || type.name}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
