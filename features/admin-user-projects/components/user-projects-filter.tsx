import React from 'react';
import { Search } from 'lucide-react';
import { translateMessage } from '@/lib/i18n-utils';
import { useTranslation } from '@/lib/i18nContext';
import Input from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { INDUSTRIES, ProjectTypeFilter } from '../hooks/use-admin-user-projects';

const TYPE_FILTER_ALL = '__all__';

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
  const { language } = useTranslation();
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-lg">
      <div className="relative flex-1">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={translateMessage('Search by project, customer, or phone...')}
          icon={<Search size={18} />}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          type="date"
          lang={language}
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          aria-label={translateMessage('From date')}
          className="app-input rounded-xl min-h-11 px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
        />
        <input
          type="date"
          lang={language}
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          aria-label={translateMessage('To date')}
          className="app-input rounded-xl min-h-11 px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
        />
        <Select
          value={typeFilter || TYPE_FILTER_ALL}
          onValueChange={(value) => setTypeFilter((value === TYPE_FILTER_ALL ? '' : value) as ProjectTypeFilter)}
        >
          <SelectTrigger className="min-h-11" aria-label={translateMessage('Project Type')}>
            <SelectValue placeholder={translateMessage('All Types')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TYPE_FILTER_ALL}>{translateMessage('All Types')}</SelectItem>
            {INDUSTRIES.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {translateMessage(industry)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
