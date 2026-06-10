import React from 'react';
import { ChevronLeft, ChevronRight, Loader2, Phone, MessageCircle, Eye } from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';
import ErrorAlert from '@/components/ui/error-alert';
import Avatar from '@/components/ui/avatar';
import { AdminLeadListItem, AdminLeadsPagination, LEAD_STATUS, LeadStatusCode } from '../types/admin-lead.types';
import { formatLeadStatusLabel, getLeadStatusCode, getLeadStatusTone, isLeadPending } from '../utils/lead-status';
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
          <div className="hidden md:block overflow-x-auto">
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

          {/* Mobile cards */}
          <div className="md:hidden grid gap-3 p-4">
            {leads.map((lead) => {
              const statusTone = getLeadStatusTone(lead.status);
              const statusCode = getLeadStatusCode(lead.status);
              const statusLabel = formatLeadStatusLabel(statusCode, language);
              const canChangeStatus = isLeadPending(lead.status);
              const waDigits = toWhatsAppDigits(lead.user.full_phone);
              const waMessage = 'السلام عليكم ورحمة الله وبركاته\nحضرتك قدمت عندنا طلب تطبيق ، طلبك مقبول ان شاء الله ممكن تفاصيل اكثر عن المشروع';
              const waUrl = waDigits
                ? `https://web.whatsapp.com/send/?phone=${waDigits}&text=${encodeURIComponent(waMessage)}&type=phone_number&app_absent=0`
                : null;

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
                    <p className="text-sm font-medium text-[var(--text)]">{lead.project_name}</p>
                    {lead.description ? (
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{lead.description}</p>
                    ) : null}
                    <p className="text-xs text-[var(--text-muted)] mt-1">{lead.date}</p>
                  </div>

                  {/* Status change + actions */}
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={statusCode}
                      disabled={!canChangeStatus || updatingLeadId === lead.id}
                      onChange={(e) => onChangeStatus(lead, Number(e.target.value) as LeadStatusCode)}
                      className="flex-1 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-xs font-bold text-[var(--text)] outline-none disabled:opacity-55 disabled:cursor-not-allowed"
                    >
                      <option value={LEAD_STATUS.PENDING}>{formatLeadStatusLabel(LEAD_STATUS.PENDING, language)}</option>
                      <option value={LEAD_STATUS.APPROVED}>{formatLeadStatusLabel(LEAD_STATUS.APPROVED, language)}</option>
                      <option value={LEAD_STATUS.REJECTED}>{formatLeadStatusLabel(LEAD_STATUS.REJECTED, language)}</option>
                    </select>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={waUrl || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => { if (!waUrl) e.preventDefault(); }}
                        className={`p-2 rounded-lg flex items-center justify-center transition-colors ${waUrl ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-[var(--surface-3)] text-[var(--text-muted)] opacity-40 cursor-not-allowed'}`}
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
