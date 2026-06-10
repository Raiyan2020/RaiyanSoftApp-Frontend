import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X, Copy, CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';
import { globalToast } from '@/lib/toast-context';
import ErrorAlert from '@/components/ui/error-alert';
import { translateMessage } from '@/lib/i18n-utils';
import { AdminLeadDetail, AdminLeadListItem } from '../types/admin-lead.types';
import { formatLeadStatusLabel, getLeadStatusTone, isLeadPending } from '../utils/lead-status';
import LeadProjectSummary from './lead-project-summary';

interface LeadDetailDrawerProps {
  listItem: AdminLeadListItem;
  lead: AdminLeadDetail | null;
  detailLoading: boolean;
  detailError: string | null;
  statusLoading: boolean;
  statusError: string | null;
  actionMessage: string | null;
  language: string;
  onClose: () => void;
  toWhatsAppDigits: (phone: string) => string | null;
  onApprove: () => void;
  onReject: () => void;
}

export default function LeadDetailDrawer({
  listItem,
  lead,
  detailLoading,
  detailError,
  statusLoading,
  statusError,
  actionMessage,
  language,
  onClose,
  toWhatsAppDigits,
  onApprove,
  onReject,
}: LeadDetailDrawerProps) {
  const { t } = useTranslation();
  const phone = lead?.user.phone || listItem.user.full_phone;
  const displayName = lead?.user.name || listItem.user.full_name;
  const projectName = lead?.project_name || listItem.project_name;
  const statusLabel = formatLeadStatusLabel(lead?.status ?? listItem.status, language);
  const statusTone = getLeadStatusTone(lead?.status ?? listItem.status);
  const canChangeStatus = lead ? isLeadPending(lead.status) : isLeadPending(listItem.status);

  const waDigits = toWhatsAppDigits(phone);
  const waMessage =
    'السلام عليكم ورحمة الله وبركاته\nحضرتك قدمت عندنا طلب تطبيق ، طلبك مقبول ان شاء الله ممكن تفاصيل اكثر عن المشروع';
  const encodedWaMessage = encodeURIComponent(waMessage);
  const waUrl = waDigits
    ? `https://web.whatsapp.com/send/?phone=${waDigits}&text=${encodedWaMessage}&type=phone_number&app_absent=0`
    : null;

  const requestId = lead?.request_id || String(listItem.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
        className="bg-[var(--surface)] w-full max-w-2xl rounded-2xl border border-[var(--border)] shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-[var(--border)] flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-[var(--text)] mb-2">{projectName}</h2>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <span>{displayName}</span>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <span dir="ltr">{phone}</span>
                  <a
                    href={waUrl || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!waUrl) e.preventDefault();
                    }}
                    className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                      waUrl
                        ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                        : 'bg-[var(--surface-3)] text-[var(--text-muted)] cursor-not-allowed opacity-50'
                    }`}
                    title={waUrl ? t('admin.leads.whatsapp') : t('admin.leads.no_phone')}
                  >
                    <MessageCircle size={14} />
                  </a>
                </div>
              </div>
              {lead?.user.email ? (
                <div className="text-sm text-[var(--text-muted)]">{lead.user.email}</div>
              ) : null}
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)]">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          <div className="flex items-center justify-between bg-[var(--surface-2)] p-4 rounded-xl border border-[var(--border)]">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--text-muted)] uppercase font-bold tracking-wider">
                {t('admin.leads.current_status')}
              </span>
              <span className={`text-sm font-bold ${statusTone.textClass}`}>{statusLabel}</span>
            </div>
            <span className="text-xs text-[var(--text-muted)]">{listItem.date}</span>
          </div>

          <div className="flex items-center justify-between bg-[var(--surface-3)] p-4 rounded-xl border border-[var(--border)]">
            <span className="text-[var(--text-muted)] text-xs uppercase font-bold tracking-wider">
              {t('admin.leads.request_id')}
            </span>
            <div className="flex items-center gap-2">
              <code className="text-[var(--text)] text-sm font-mono bg-[var(--surface-2)] px-2 py-1 rounded border border-[var(--border)]">
                {requestId}
              </code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(requestId);
                  globalToast.success(t('admin.leads.copied'));
                }}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] bg-[var(--surface-2)] rounded border border-[var(--border)] hover:bg-[var(--surface-3)] transition-colors"
                title={t('admin.leads.copy_id')}
              >
                <Copy size={14} />
              </button>
            </div>
          </div>

          {detailLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin text-primary" size={28} />
            </div>
          ) : null}

          {detailError ? (
            <ErrorAlert message={detailError} />
          ) : null}

          {lead ? (
            <LeadProjectSummary
              projectName={lead.project_name || listItem.project_name}
              color={lead.color || '#3498db'}
              description={lead.description || listItem.description}
              answers={lead.answers}
            />
          ) : !detailLoading && !detailError ? (
            <LeadProjectSummary
              projectName={listItem.project_name}
              color="#3498db"
              description={listItem.description}
              answers={[]}
            />
          ) : null}

          {statusError ? (
            <ErrorAlert message={statusError} />
          ) : null}

          {actionMessage ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">
              {translateMessage(actionMessage)}
            </div>
          ) : null}

          {canChangeStatus ? (
            <div className="pt-4 border-t border-[var(--border)] space-y-3">
              <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">
                {t('admin.leads.review_actions')}
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onApprove}
                  disabled={statusLoading}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {statusLoading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                  <span>{t('admin.leads.approve')}</span>
                </button>
                <button
                  type="button"
                  onClick={onReject}
                  disabled={statusLoading}
                  className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-bold border border-red-500/20 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {statusLoading ? <Loader2 className="animate-spin" size={18} /> : <XCircle size={18} />}
                  <span>{t('admin.leads.reject')}</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
