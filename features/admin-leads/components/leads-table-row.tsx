import React from 'react';
import { Phone, MessageCircle, Eye, Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';
import { formatLocalizedDate } from '@/lib/language';
import { toWhatsAppUrl } from '@/lib/utils';
import Avatar from '@/components/ui/avatar';
import { TableRow, TableCell } from '@/components/ui/table';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { AdminLeadListItem, LEAD_STATUS, LeadStatusCode } from '../types/admin-lead.types';
import { formatLeadStatusLabel, getLeadStatusCode, getLeadStatusTone, isLeadPending } from '../utils/lead-status';
import { LEAD_APPROVAL_WHATSAPP_MESSAGE } from '../utils/whatsapp-template';

interface LeadsTableRowProps {
  lead: AdminLeadListItem;
  onSelectLead: (lead: AdminLeadListItem) => void;
  isUpdatingStatus: boolean;
  onChangeStatus: (lead: AdminLeadListItem, nextStatus: LeadStatusCode) => void;
}

export default function LeadsTableRow({
  lead,
  onSelectLead,
  isUpdatingStatus,
  onChangeStatus,
}: LeadsTableRowProps) {
  const { t, language } = useTranslation();
  const waUrl = toWhatsAppUrl(lead.user.full_phone, LEAD_APPROVAL_WHATSAPP_MESSAGE);

  const statusTone = getLeadStatusTone(lead.status);
  const statusCode = getLeadStatusCode(lead.status);
  const statusLabel = formatLeadStatusLabel(statusCode, language);
  const canChangeStatus = isLeadPending(lead.status);
  const typeLabel = !lead.type
    ? ''
    : typeof lead.type === 'string'
    ? lead.type
    : lead.type.name || lead.type.key || lead.type.value || '';

  return (
    <TableRow className="hover:bg-white/[0.02] group">
      <TableCell className="p-5 text-start text-[var(--text-muted)] text-xs font-mono">{lead.request_id || '-'}</TableCell>
      <TableCell className="p-5 text-start">
        <div className="flex items-center gap-3">
          <Avatar name={lead.user.full_name} size="md" className="w-10 h-10 text-sm" />
          <div>
            <div className="font-bold text-[var(--text)]">{lead.user.full_name}</div>
            <div className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <Phone size={10} /> {lead.user.full_phone}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="p-5 text-start">
        <div className="font-medium text-[var(--text)]">{lead.project_name}</div>
        <div className="text-xs text-[var(--text-muted)] truncate max-w-[220px]">{lead.description}</div>
      </TableCell>
      <TableCell className="p-5 text-start text-[var(--text-muted)] text-xs">{typeLabel || '-'}</TableCell>
      <TableCell className="p-5 text-start">
        <div className="flex items-center gap-2">
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${statusTone.badgeClass}`}>
            {statusLabel}
          </span>
          <div className="relative">
            <Select
              value={String(statusCode)}
              disabled={!canChangeStatus || isUpdatingStatus}
              onValueChange={(nextValue) => onChangeStatus(lead, Number(nextValue) as LeadStatusCode)}
            >
              <SelectTrigger
                className="h-9 w-auto min-w-32 rounded-lg border border-[var(--border)] bg-[var(--surface-3)] px-3 py-0 pe-8 text-xs font-bold text-[var(--text)] outline-none transition-colors hover:border-primary/40 focus:border-primary disabled:cursor-not-allowed disabled:opacity-55"
                title={canChangeStatus ? t('admin.leads.change_status') : t('admin.leads.status_locked')}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(LEAD_STATUS.PENDING)}>{formatLeadStatusLabel(LEAD_STATUS.PENDING, language)}</SelectItem>
                <SelectItem value={String(LEAD_STATUS.APPROVED)}>{formatLeadStatusLabel(LEAD_STATUS.APPROVED, language)}</SelectItem>
                <SelectItem value={String(LEAD_STATUS.REJECTED)}>{formatLeadStatusLabel(LEAD_STATUS.REJECTED, language)}</SelectItem>
              </SelectContent>
            </Select>
            {isUpdatingStatus ? (
              <Loader2
                size={14}
                className="pointer-events-none absolute top-1/2 -translate-y-1/2 animate-spin text-primary end-2"
              />
            ) : null}
          </div>
        </div>
      </TableCell>
      <TableCell className="p-5 text-start text-[var(--text-muted)] text-xs">{formatLocalizedDate(lead.date, language)}</TableCell>
      <TableCell className="p-5 text-start">
        <div className="flex items-center justify-start gap-2">
          <button
            type="button"
            onClick={() => onSelectLead(lead)}
            className="p-2 bg-[var(--surface-3)] hover:bg-[var(--surface-3)] text-[var(--text)] hover:text-[var(--text)] rounded-lg transition-colors"
          >
            <Eye size={16} />
          </button>

          <a
            href={waUrl || undefined}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!waUrl) e.preventDefault();
            }}
            className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
              waUrl
                ? 'bg-[color-mix(in_srgb,var(--success)_8%,transparent)] text-success hover:bg-[color-mix(in_srgb,var(--success)_20%,transparent)]'
                : 'bg-[var(--surface-3)] text-[var(--text-muted)] cursor-not-allowed opacity-50'
            }`}
            title={waUrl ? t('admin.leads.whatsapp') : t('admin.leads.no_phone')}
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </TableCell>
    </TableRow>
  );
}
