import React from 'react';
import { Loader2, Phone, MessageCircle, Eye } from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';
import { formatLocalizedDate } from '@/lib/language';
import { toWhatsAppUrl } from '@/lib/utils';
import ErrorAlert from '@/components/ui/error-alert';
import TablePagination from '@/components/ui/table-pagination';
import Avatar from '@/components/ui/avatar';
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminLeadListItem, AdminLeadsPagination, LEAD_STATUS, LeadStatusCode } from '../types/admin-lead.types';
import { formatLeadStatusLabel, getLeadStatusCode, getLeadStatusTone, isLeadPending } from '../utils/lead-status';
import { LEAD_APPROVAL_WHATSAPP_MESSAGE } from '../utils/whatsapp-template';
import LeadsTableRow from './leads-table-row';

function leadTypeLabel(type: AdminLeadListItem['type']): string {
  if (!type) return '';
  if (typeof type === 'string') return type;
  return type.name || type.key || type.value || '';
}

interface LeadsTableProps {
  leads: AdminLeadListItem[];
  loading: boolean;
  error: string | null;
  pagination: AdminLeadsPagination | null;
  onSelectLead: (lead: AdminLeadListItem) => void;
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
  onPageChange,
  updatingLeadId,
  onChangeStatus,
}: LeadsTableProps) {
  const { t, language } = useTranslation();

  if (loading && leads.length === 0) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-12 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-12 text-center text-[var(--text-muted)]">
        <ErrorAlert message={error} />
        {t('admin.leads.no_results')}
      </div>
    );
  }

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden">
      {leads.length === 0 ? (
        <div className="p-12 text-center text-[var(--text-muted)]">{t('admin.leads.no_results')}</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <Table className="text-start">
              <TableHeader>
                <TableRow className="border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider hover:bg-transparent">
                  <TableHead className="p-5 font-medium text-start">{t('admin.leads.reference')}</TableHead>
                  <TableHead className="p-5 font-medium text-start">{t('admin.leads.name')}</TableHead>
                  <TableHead className="p-5 font-medium text-start">{t('admin.leads.project_info')}</TableHead>
                  <TableHead className="p-5 font-medium text-start">{t('admin.leads.type')}</TableHead>
                  <TableHead className="p-5 font-medium text-start">{t('admin.leads.status')}</TableHead>
                  <TableHead className="p-5 font-medium text-start">{t('admin.leads.date')}</TableHead>
                  <TableHead className="p-5 font-medium text-start">{t('admin.leads.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-[var(--border)] text-sm">
                {leads.map((lead) => (
                  <LeadsTableRow
                    key={lead.id}
                    lead={lead}
                    onSelectLead={onSelectLead}
                    isUpdatingStatus={updatingLeadId === lead.id}
                    onChangeStatus={onChangeStatus}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden grid gap-3 p-4">
            {leads.map((lead) => {
              const statusTone = getLeadStatusTone(lead.status);
              const statusCode = getLeadStatusCode(lead.status);
              const statusLabel = formatLeadStatusLabel(statusCode, language);
              const canChangeStatus = isLeadPending(lead.status);
              const waUrl = toWhatsAppUrl(lead.user.full_phone, LEAD_APPROVAL_WHATSAPP_MESSAGE);

              return (
                <div key={lead.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 flex flex-col gap-3">
                  {/* Card header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={lead.user.full_name} size="md" className="w-10 h-10 shrink-0 text-sm" />
                      <div className="min-w-0">
                        <p className="font-bold text-[var(--text)] truncate">{lead.user.full_name}</p>
                        <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                          <Phone size={10} /> {lead.user.full_phone}
                        </p>
                      </div>
                    </div>
                    <span className={`shrink-0 inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${statusTone.badgeClass}`}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Project info */}
                  <div className="rounded-lg bg-[var(--surface)] border border-[var(--border)] px-3 py-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[var(--text-muted)]">{t('admin.leads.reference')}</span>
                      <span className="font-mono text-[var(--text)]">{lead.request_id || '-'}</span>
                    </div>
                    <p className="text-sm font-medium text-[var(--text)]">{lead.project_name}</p>
                    {lead.description ? (
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{lead.description}</p>
                    ) : null}
                    {leadTypeLabel(lead.type) ? (
                      <p className="text-xs text-[var(--text-muted)] mt-1">{leadTypeLabel(lead.type)}</p>
                    ) : null}
                    <p className="text-xs text-[var(--text-muted)] mt-1">{formatLocalizedDate(lead.date, language)}</p>
                  </div>

                  {/* Status change + actions */}
                  <div className="flex items-center justify-between gap-2">
                    <Select
                      value={String(statusCode)}
                      disabled={!canChangeStatus || updatingLeadId === lead.id}
                      onValueChange={(value) => onChangeStatus(lead, Number(value) as LeadStatusCode)}
                    >
                      <SelectTrigger className="flex-1 h-9 min-h-0 px-2 text-xs font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={String(LEAD_STATUS.PENDING)}>{formatLeadStatusLabel(LEAD_STATUS.PENDING, language)}</SelectItem>
                        <SelectItem value={String(LEAD_STATUS.APPROVED)}>{formatLeadStatusLabel(LEAD_STATUS.APPROVED, language)}</SelectItem>
                        <SelectItem value={String(LEAD_STATUS.REJECTED)}>{formatLeadStatusLabel(LEAD_STATUS.REJECTED, language)}</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={waUrl || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => { if (!waUrl) e.preventDefault(); }}
                        title={waUrl ? t('admin.leads.whatsapp') : t('admin.leads.no_phone')}
                        aria-label={waUrl ? t('admin.leads.whatsapp') : t('admin.leads.no_phone')}
                        aria-disabled={!waUrl}
                        className={`p-2 rounded-lg flex items-center justify-center transition-colors ${waUrl ? 'bg-[color-mix(in_srgb,var(--success)_8%,transparent)] text-success hover:bg-[color-mix(in_srgb,var(--success)_20%,transparent)]' : 'bg-[var(--surface-3)] text-[var(--text-muted)] opacity-40 cursor-not-allowed'}`}
                      >
                        <MessageCircle size={16} />
                      </a>
                      <button
                        type="button"
                        onClick={() => onSelectLead(lead)}
                        className="p-2 bg-[var(--surface-3)] text-[var(--text)] rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <TablePagination
        pagination={pagination}
        onPageChange={onPageChange}
        loading={loading}
        className="border-t border-[var(--border)] px-5 py-4"
      />
    </div>
  );
}
