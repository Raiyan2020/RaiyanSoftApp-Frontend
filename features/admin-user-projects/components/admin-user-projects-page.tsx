import React from 'react';
import ErrorAlert from '@/components/ui/error-alert';
import { translateMessage } from '@/lib/i18n-utils';
import { useAdminUserProjects } from '../hooks/use-admin-user-projects';
import UserProjectsFilter from './user-projects-filter';
import UserProjectsTable from './user-projects-table';
import UserProjectEditDrawer from './user-project-edit-drawer';

export default function AdminUserProjectsPage() {
  const {
    loading,
    error,
    searchTerm,
    setSearchTerm,
    editingProject,
    setEditingProject,
    formData,
    setFormData,
    isSaving,
    filteredProjects,
    handleEdit,
    handleSave,
    formatDate,
  } = useAdminUserProjects();

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[var(--text)] flex items-center gap-3">
          {translateMessage('User Projects')}
          <span className="text-xs font-normal text-[var(--text-muted)] bg-[var(--surface-3)] px-2 py-1 rounded-full border border-[var(--border)]">
            {filteredProjects.length} {translateMessage('Total')}
          </span>
        </h1>
        <p className="text-[var(--text-muted)] text-sm">{translateMessage('Projects created by customers inside their accounts.')}</p>
      </div>

      {error ? <ErrorAlert message={error} /> : null}

      <UserProjectsFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <UserProjectsTable
        loading={loading}
        error={error}
        filteredProjects={filteredProjects}
        onEdit={handleEdit}
        formatDate={formatDate}
      />

      <UserProjectEditDrawer
        editingProject={editingProject}
        onClose={() => setEditingProject(null)}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
