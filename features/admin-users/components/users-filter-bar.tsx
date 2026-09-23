import React from 'react';
import { Search } from 'lucide-react';
import Input from '@/components/ui/input';
import { translateMessage } from '@/lib/i18n-utils';

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
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={translateMessage('Search users by name, email, or phone...')}
          icon={<Search size={18} />}
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
                ? 'bg-primary/10 text-primary border-primary/30 shadow-[0_0_10px_rgb(var(--primary-glow-rgb) / 0.2)]'
                : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border)]'
            }`}
          >
            {translateMessage(status)}
          </button>
        ))}
      </div>
    </div>
  );
}
