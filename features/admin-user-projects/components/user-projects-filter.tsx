import React from 'react';
import { Search } from 'lucide-react';
import { translateMessage } from '@/lib/i18n-utils';
import { INDUSTRIES, ProjectTypeFilter } from '../hooks/use-admin-user-projects';

interface UserProjectsFilterProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  dateFrom: string;
  setDateFrom: (val: string) => void;
  dateTo: string;
  setDateTo: (val: string) => void;
  typeFilter: ProjectTypeFilter;
  setTypeFilter: (val: ProjectTypeFilter) => void;
}

export default function UserProjectsFilter({
  searchTerm,
  setSearchTerm,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  typeFilter,
  setTypeFilter,
}: UserProjectsFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-lg">
      <div className="relative flex-1">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={translateMessage('Search by project, customer, or phone...')}
          className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-2.5 ps-10 pe-4 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary transition-colors"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          aria-label={translateMessage('From date')}
          className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-2.5 px-3 text-[var(--text)] focus:outline-none focus:border-primary transition-colors"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          aria-label={translateMessage('To date')}
          className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-2.5 px-3 text-[var(--text)] focus:outline-none focus:border-primary transition-colors"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ProjectTypeFilter)}
          aria-label={translateMessage('Project Type')}
          className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-2.5 px-3 text-[var(--text)] focus:outline-none focus:border-primary transition-colors"
        >
          <option value="">{translateMessage('All Types')}</option>
          {INDUSTRIES.map((industry) => (
            <option key={industry} value={industry}>
              {translateMessage(industry)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
