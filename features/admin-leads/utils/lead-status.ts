import { LEAD_STATUS, LeadStatusCode } from '../types/admin-lead.types';

export function getLeadStatusCode(status: string | LeadStatusCode): LeadStatusCode {
  if (typeof status === 'number') return status;

  const lower = status.toLowerCase();
  if (
    lower.includes('reject') ||
    status.includes('مرفوض') ||
    status.includes('رفض')
  ) {
    return LEAD_STATUS.REJECTED;
  }

  if (
    lower.includes('approv') ||
    status.includes('مقبول') ||
    status.includes('وافق') ||
    status.includes('الموافقة')
  ) {
    return LEAD_STATUS.APPROVED;
  }

  return LEAD_STATUS.PENDING;
}

export function getLeadStatusTone(status: string | LeadStatusCode) {
  const normalized = getLeadStatusCode(status);

  if (normalized === LEAD_STATUS.APPROVED) {
    return {
      badgeClass: 'bg-[color-mix(in_srgb,var(--success)_10%,transparent)] text-success',
      textClass: 'text-success',
    };
  }

  if (normalized === LEAD_STATUS.REJECTED) {
    return {
      badgeClass: 'bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-danger',
      textClass: 'text-danger',
    };
  }

  return {
    badgeClass: 'bg-[color-mix(in_srgb,var(--info)_10%,transparent)] text-info',
    textClass: 'text-info',
  };
}

export function isLeadPending(status: string | LeadStatusCode) {
  if (typeof status === 'number') return status === LEAD_STATUS.PENDING || status === LEAD_STATUS.REJECTED;
  const lower = status.toLowerCase();
  return lower.includes('pending') || lower.includes('reject') || status.includes('قيد') || status.includes('انتظار') || status.includes('مرفوض') || status.includes('رفض');
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
