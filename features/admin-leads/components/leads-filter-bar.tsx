import React from 'react';
import { Search } from 'lucide-react';
import { LeadStatusFilter } from '../hooks/use-admin-leads';

interface LeadsFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: LeadStatusFilter;
  setStatusFilter: (val: LeadStatusFilter) => void;
}

const STATUS_OPTIONS: { value: LeadStatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export default function LeadsFilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: LeadsFilterBarProps) {
  return (
    <div className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-lg flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, phone, or project..."
          className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary transition-colors"
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
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
}
