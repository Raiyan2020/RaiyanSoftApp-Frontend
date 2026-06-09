import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';
import { AdminLeadListItem, AdminLeadsPagination, LeadStatusCode } from '../types/admin-lead.types';
import LeadsTableRow from './leads-table-row';

interface LeadsTableProps {
  leads: AdminLeadListItem[];
  loading: boolean;
  error: string | null;
  pagination: AdminLeadsPagination | null;
  onSelectLead: (lead: AdminLeadListItem) => void;
  toWhatsAppDigits: (phone: string) => string | null;
  onPageChange: (page: number) => void;
  updatingLeadId: number | null;
  onChangeStatus: (lead: AdminLeadListItem, nextStatus: LeadStatusCode) => void;
}

export default function LeadsTable({
  leads,
  loading,
  error,
  pagination,
  onSelectLead,
  toWhatsAppDigits,
  onPageChange,
  updatingLeadId,
  onChangeStatus,
}: LeadsTableProps) {
  const { t } = useTranslation();

  if (loading && leads.length === 0) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-12 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--surface)] border border-red-500/20 rounded-2xl shadow-xl p-12 text-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden">
      {leads.length === 0 ? (
        <div className="p-12 text-center text-[var(--text-muted)]">{t('admin.leads.no_results')}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider">
                <th className="p-5 font-medium">{t('admin.leads.name')}</th>
                <th className="p-5 font-medium">{t('admin.leads.project_info')}</th>
                <th className="p-5 font-medium">{t('admin.leads.status')}</th>
                <th className="p-5 font-medium">{t('admin.leads.date')}</th>
                <th className="p-5 font-medium text-right">{t('admin.leads.action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-sm">
              {leads.map((lead) => (
                <LeadsTableRow
                  key={lead.id}
                  lead={lead}
                  onSelectLead={onSelectLead}
                  toWhatsAppDigits={toWhatsAppDigits}
                  isUpdatingStatus={updatingLeadId === lead.id}
                  onChangeStatus={onChangeStatus}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination && pagination.last_page > 1 ? (
        <div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-4 text-sm text-[var(--text-muted)]">
          <span>
            {t('admin.leads.page_of')
              .replace('{current}', String(pagination.current_page))
              .replace('{last}', String(pagination.last_page))
              .replace('{total}', String(pagination.total))}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.current_page <= 1 || loading}
              onClick={() => onPageChange(pagination.current_page - 1)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              disabled={pagination.current_page >= pagination.last_page || loading}
              onClick={() => onPageChange(pagination.current_page + 1)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
