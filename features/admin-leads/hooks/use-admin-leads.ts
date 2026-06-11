'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@/lib/i18nContext';
import { AdminLeadListItem, LEAD_STATUS, LeadStatusCode } from '../types/admin-lead.types';
import { getLeadStatusCode } from '../utils/lead-status';
import { useAdminLeadsList } from './use-admin-leads-list';
import { useAdminLead } from './use-admin-lead';
import { useChangeLeadStatus } from './use-change-lead-status';

export type LeadStatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

const STATUS_FILTER_MAP: Record<Exclude<LeadStatusFilter, 'all'>, LeadStatusCode> = {
  pending: LEAD_STATUS.PENDING,
  approved: LEAD_STATUS.APPROVED,
  rejected: LEAD_STATUS.REJECTED,
};

export function useAdminLeads() {
  const { language } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<LeadStatusFilter>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [selectedListItem, setSelectedListItem] = useState<AdminLeadListItem | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [updatingLeadId, setUpdatingLeadId] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchQuery.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const filters = useMemo(
    () => ({
      name: debouncedSearch || undefined,
      status: statusFilter === 'all' ? undefined : STATUS_FILTER_MAP[statusFilter],
      page,
    }),
    [debouncedSearch, page, statusFilter]
  );

  const {
    leads,
    pagination,
    loading: listLoading,
    error: listError,
    reload: reloadList,
  } = useAdminLeadsList(filters, language);

  useEffect(() => {
    if (!selectedLeadId) return;
    const refreshed = leads.find((lead) => lead.id === selectedLeadId);
    if (refreshed) setSelectedListItem(refreshed);
  }, [leads, selectedLeadId]);

  const {
    lead: selectedLead,
    loading: detailLoading,
    error: detailError,
    reload: reloadDetail,
  } = useAdminLead(selectedLeadId, language, selectedLeadId !== null);

  const {
    changeStatus,
    loading: statusLoading,
    error: statusError,
  } = useChangeLeadStatus();

  const openLead = (lead: AdminLeadListItem) => {
    setSelectedLeadId(lead.id);
    setSelectedListItem(lead);
    setActionMessage(null);
  };

  const closeLead = (options?: { clearMessage?: boolean }) => {
    const clearMessage = options?.clearMessage ?? true;
    setSelectedLeadId(null);
    setSelectedListItem(null);
    if (clearMessage) {
      setActionMessage(null);
    }
  };

  const handleApprove = async () => {
    if (!selectedLeadId) return;

    try {
      await changeStatus(selectedLeadId, 'approve');
      setActionMessage('Lead approved successfully.');
      await Promise.all([reloadList(), reloadDetail()]);
      closeLead({ clearMessage: false });
    } catch {
      // error surfaced via statusError
    }
  };

  const handleReject = async () => {
    if (!selectedLeadId) return;

    try {
      await changeStatus(selectedLeadId, 'reject');
      setActionMessage('Lead rejected successfully.');
      await Promise.all([reloadList(), reloadDetail()]);
      closeLead({ clearMessage: false });
    } catch {
      // error surfaced via statusError
    }
  };

  const handleStatusChange = async (lead: AdminLeadListItem, nextStatus: LeadStatusCode) => {
    const currentStatus = getLeadStatusCode(lead.status);
    if (currentStatus === nextStatus || updatingLeadId) return;
    if (nextStatus === LEAD_STATUS.PENDING) return;

    setUpdatingLeadId(lead.id);

    try {
      await changeStatus(
        lead.id,
        nextStatus === LEAD_STATUS.APPROVED ? 'approve' : 'reject'
      );
      setActionMessage(
        nextStatus === LEAD_STATUS.APPROVED
          ? 'Lead approved successfully.'
          : 'Lead rejected successfully.'
      );

      await Promise.all([
        reloadList(),
        selectedLeadId === lead.id ? reloadDetail() : Promise.resolve(),
      ]);
    } catch {
      // error surfaced via statusError
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const toWhatsAppDigits = (phone: string): string | null => {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, '');

    if (digits.length === 8) return `965${digits}`;
    if (digits.length < 8) return null;

    return digits;
  };

  const goToPage = (nextPage: number) => {
    if (!pagination) return;
    const safePage = Math.min(Math.max(1, nextPage), pagination.last_page);
    setPage(safePage);
  };

  return {
    leads,
    pagination,
    listLoading,
    listError,
    reloadList,
    selectedLead,
    selectedListItem,
    detailLoading,
    detailError,
    statusLoading,
    statusError,
    updatingLeadId,
    actionMessage,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    language,
    openLead,
    closeLead,
    handleApprove,
    handleReject,
    handleStatusChange,
    toWhatsAppDigits,
    page,
    goToPage,
  };
}
