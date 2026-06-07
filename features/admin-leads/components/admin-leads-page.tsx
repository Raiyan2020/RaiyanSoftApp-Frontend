import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAdminLeads } from '../hooks/use-admin-leads';
import LeadsFilterBar from './leads-filter-bar';
import LeadsTable from './leads-table';
import LeadDetailDrawer from './lead-detail-drawer';

export default function AdminLeadsPage() {
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
    toWhatsAppDigits,
    goToPage,
  } = useAdminLeads();

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Leads</h1>
          <p className="text-[var(--text-muted)] text-sm">Manage incoming project requests.</p>
        </div>
        {pagination ? (
          <p className="text-sm text-[var(--text-muted)]">{pagination.total} total leads</p>
        ) : null}
      </div>

      <LeadsFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <LeadsTable
        leads={leads}
        loading={listLoading}
        error={listError}
        pagination={pagination}
        onSelectLead={openLead}
        toWhatsAppDigits={toWhatsAppDigits}
        onPageChange={goToPage}
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
            toWhatsAppDigits={toWhatsAppDigits}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
