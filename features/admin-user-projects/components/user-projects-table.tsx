import React from 'react';
import { LayoutGrid, Loader2 } from 'lucide-react';
import { UserProject } from '@/lib/userProjectsStore';
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table';
import { translateMessage } from '@/lib/i18n-utils';
import UserProjectsRow from './user-projects-row';

interface UserProjectsTableProps {
  loading: boolean;
  error: string | null;
  filteredProjects: UserProject[];
  onEdit: (project: UserProject) => void;
  formatDate: (ts: number) => string;
}

export default function UserProjectsTable({
  loading,
  error,
  filteredProjects,
  onEdit,
  formatDate,
}: UserProjectsTableProps) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden min-h-[400px]">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
          <Loader2 size={32} className="animate-spin mb-4 text-primary" />
          <p>{translateMessage('Loading projects...')}</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
          <div className="w-16 h-16 bg-[var(--surface-3)] rounded-full flex items-center justify-center mb-4 border border-[var(--border)]">
            <LayoutGrid size={24} />
          </div>
          <p>{translateMessage(error ? 'Unable to load data.' : 'No user projects found.')}</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <Table className="text-start border-collapse">
              <TableHeader>
                <TableRow className="border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider hover:bg-transparent">
                  <TableHead className="p-5 font-medium text-start">{translateMessage('Reference')}</TableHead>
                  <TableHead className="p-5 font-medium text-start">{translateMessage('Project')}</TableHead>
                  <TableHead className="p-5 font-medium text-start">{translateMessage('Type')}</TableHead>
                  <TableHead className="p-5 font-medium text-start">{translateMessage('Status')}</TableHead>
                  <TableHead className="p-5 font-medium text-start">{translateMessage('Pricing')}</TableHead>
                  <TableHead className="p-5 font-medium text-start">{translateMessage('Customer')}</TableHead>
                  <TableHead className="p-5 font-medium text-start">{translateMessage('Created')}</TableHead>
                  <TableHead className="p-5 font-medium text-start">{translateMessage('Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-[var(--border)] text-sm">
                {filteredProjects.map((p) => (
                  <UserProjectsRow key={p.id} project={p} onEdit={onEdit} formatDate={formatDate} variant="desktop" />
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden grid gap-3 p-4">
            {filteredProjects.map((p) => (
              <UserProjectsRow key={p.id} project={p} onEdit={onEdit} formatDate={formatDate} variant="mobile" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
