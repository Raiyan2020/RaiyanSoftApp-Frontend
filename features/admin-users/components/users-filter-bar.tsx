import React from 'react';
import { Search } from 'lucide-react';

interface UsersFilterBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filterStatus: 'All' | 'Active' | 'Disabled';
  setFilterStatus: (val: 'All' | 'Active' | 'Disabled') => void;
}

export default function UsersFilterBar({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
}: UsersFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-lg">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users by name, email, or phone..."
          className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
        {(['All', 'Active', 'Disabled'] as const).map((status) => (
          <button
            type="button"
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
              filterStatus === status
                ? 'bg-primary/10 text-primary border-primary/30 shadow-[0_0_10px_rgba(29,183,240,0.2)]'
                : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border)]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}
