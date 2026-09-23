import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18nContext';
import { useAdminLeads } from '../hooks/use-admin-leads';
import LeadsFilterBar from './leads-filter-bar';
import LeadsTable from './leads-table';
import LeadDetailDrawer from './lead-detail-drawer';
import ErrorAlert from '@/components/ui/error-alert';
import SuccessToast from '@/components/ui/success-toast';
import ReasonDialog from '@/components/ui/reason-dialog';

export default function AdminLeadsPage() {
  const { t } = useTranslation();
  const {
    leads,
    pagination,
    listLoading,
    listError,
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
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    typeFilter,
    setTypeFilter,
    language,
    openLead,
    closeLead,
    handleApprove,
    handleReject,
    rejectingLeadId,
    cancelReject,
    submitReject,
    handleStatusChange,
    goToPage,
  } = useAdminLeads();

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">{t('admin.leads.title')}</h1>
          <p className="text-[var(--text-muted)] text-sm">{t('admin.leads.subtitle')}</p>
        </div>
        {pagination ? (
          <p className="text-sm text-[var(--text-muted)]">{pagination.total} {t('admin.leads.total')}</p>
        ) : null}
      </div>

      <LeadsFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {statusError ? (
        <ErrorAlert message={statusError} />
      ) : null}
      <SuccessToast message={actionMessage} />

      <LeadsTable
        leads={leads}
        loading={listLoading}
        error={listError}
        pagination={pagination}
        onSelectLead={openLead}
        onPageChange={goToPage}
        updatingLeadId={updatingLeadId}
        onChangeStatus={handleStatusChange}
      />

      <AnimatePresence>
        {selectedListItem ? (
          <LeadDetailDrawer
            listItem={selectedListItem}
            lead={selectedLead}
            detailLoading={detailLoading}
            detailError={detailError}
            statusLoading={statusLoading}
            statusError={statusError}
            actionMessage={actionMessage}
            language={language}
            onClose={closeLead}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ) : null}
      </AnimatePresence>

      <ReasonDialog
        open={rejectingLeadId !== null}
        title={t('admin.leads.reject')}
        onClose={cancelReject}
        onSubmit={submitReject}
      />
    </div>
  );
}
