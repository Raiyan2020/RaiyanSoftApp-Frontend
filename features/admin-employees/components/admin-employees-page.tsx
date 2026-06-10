import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader2, Plus, Search } from 'lucide-react';
import ConfirmModal from '@/components/ui/confirm-modal';
import { useAdminEmployees } from '../hooks/use-admin-employees';
import ErrorAlert from '@/components/ui/error-alert';
import { translateMessage } from '@/lib/i18n-utils';
import EmployeesTable from './employees-table';
import EmployeeFormModal from './employee-form-modal';
import EmployeeDetailDrawer from './employee-detail-drawer';

export default function AdminEmployeesPage() {
  const {
    searchTerm,
    setSearchTerm,
    isModalOpen,
    setIsModalOpen,
    editingEmployee,
    selectedEmployee,
    detailLoading,
    deleteId,
    setDeleteId,
    isSubmitting,
    deleteLoading,
    toggleLoading,
    createdPassword,
    formData,
    setFormData,
    actionMessage,
    actionError,
    listLoading,
    listError,
    filteredEmployees,
    handleOpenModal,
    generatePassword,
    handleSubmit,
    handleToggleStatus,
    handleDelete,
    openEmployee,
    closeEmployee,
  } = useAdminEmployees();

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">{translateMessage('Admins & Staff')}</h1>
          <p className="text-[var(--text-muted)] text-sm">{translateMessage('Manage dashboard access and permissions.')}</p>
        </div>
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-sky-400 text-white px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
          <span>{translateMessage('Add Employee')}</span>
        </button>
      </div>

      <div className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-lg">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={translateMessage('Search by name or email...')}
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-2.5 pl-10 pr-4 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {listError ? <ErrorAlert message={listError} /> : null}

      {listLoading && filteredEmployees.length === 0 ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : (
        <EmployeesTable
          employees={filteredEmployees}
          onSelectEmployee={openEmployee}
          onOpenModal={handleOpenModal}
          onDeleteEmployee={setDeleteId}
        />
      )}

      <AnimatePresence>
        {isModalOpen ? (
          <EmployeeFormModal
            onClose={() => setIsModalOpen(false)}
            editingEmployee={editingEmployee}
            createdPassword={createdPassword}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            generatePassword={generatePassword}
            isSubmitting={isSubmitting}
            errorMessage={actionError}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEmployee ? (
          <EmployeeDetailDrawer
            employee={selectedEmployee}
            loading={detailLoading}
            onClose={closeEmployee}
            onToggleStatus={handleToggleStatus}
            onDeleteEmployee={setDeleteId}
            toggleLoading={toggleLoading}
            actionMessage={actionMessage}
            actionError={actionError}
          />
        ) : null}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Employee?"
        message="This action is permanent."
        confirmText="Delete"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
