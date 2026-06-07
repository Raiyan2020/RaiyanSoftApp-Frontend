import { LEAD_STATUS, LeadStatusCode } from '../types/admin-lead.types';

export function getLeadStatusTone(status: string | LeadStatusCode) {
  const normalized =
    typeof status === 'number'
      ? status
      : status.toLowerCase().includes('reject') || status.includes('مرفوض')
        ? LEAD_STATUS.REJECTED
        : status.toLowerCase().includes('approv') || status.includes('مقبول')
          ? LEAD_STATUS.APPROVED
          : LEAD_STATUS.PENDING;

  if (normalized === LEAD_STATUS.APPROVED) {
    return {
      badgeClass: 'bg-emerald-500/10 text-emerald-400',
      textClass: 'text-emerald-400',
    };
  }

  if (normalized === LEAD_STATUS.REJECTED) {
    return {
      badgeClass: 'bg-red-500/10 text-red-400',
      textClass: 'text-red-400',
    };
  }

  return {
    badgeClass: 'bg-blue-500/10 text-blue-400',
    textClass: 'text-blue-400',
  };
}

export function isLeadPending(status: string | LeadStatusCode) {
  if (typeof status === 'number') return status === LEAD_STATUS.PENDING;
  const lower = status.toLowerCase();
  return lower.includes('pending') || status.includes('قيد');
}

export function formatLeadStatusLabel(status: string | LeadStatusCode, language: string) {
  if (typeof status === 'string' && Number.isNaN(Number(status))) {
    return status;
  }

  const code = typeof status === 'number' ? status : Number(status);

  if (code === LEAD_STATUS.APPROVED) {
    return language === 'ar' ? 'مقبول' : 'Approved';
  }

  if (code === LEAD_STATUS.REJECTED) {
    return language === 'ar' ? 'مرفوض' : 'Rejected';
  }

  return language === 'ar' ? 'قيد الانتظار' : 'Pending';
}
