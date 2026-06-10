import React from 'react';
import { Search } from 'lucide-react';
import { translateMessage } from '@/lib/i18n-utils';

interface UserProjectsFilterProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

export default function UserProjectsFilter({ searchTerm, setSearchTerm }: UserProjectsFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-lg">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={translateMessage('Search by project, customer, or email...')}
          className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary transition-colors"
        />
      </div>
    </div>
  );
}
