import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import ConfirmModal from '@/components/ui/confirm-modal';
import { useAdminProjects } from '../hooks/use-admin-projects';
import AdminProjectCard from './admin-project-card';
import ProjectFormModal from './project-form-modal';
import EmptyState from '@/components/ui/empty-state';
import Input from '@/components/ui/input';
import { translateMessage } from '@/lib/i18n-utils';

export default function AdminProjectsPage() {
  const {
    searchTerm,
    setSearchTerm,
    isModalOpen,
    editingProject,
    deleteId,
    setDeleteId,
    formData,
    setFormData,
    filteredProjects,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
  } = useAdminProjects();

  return (
    <div className="space-y-12 pb-20">
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">{translateMessage('Client Projects')}</h1>
            <p className="text-[var(--text-muted)] text-sm">
              {translateMessage('Manage the projects displayed on the mobile app home screen.')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="bg-primary hover:bg-primary-dark text-on-primary px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20"
          >
            <Plus size={20} />
            <span>{translateMessage('Add Project')}</span>
          </button>
        </div>

        <div className="relative mb-6 md:max-w-md">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={translateMessage('Search projects...')}
            icon={<Search size={18} />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <AdminProjectCard
                key={project.id}
                project={project}
                onOpenModal={handleOpenModal}
                onDeleteProject={setDeleteId}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* The empty state used to blame the search even when there was no
            search term and simply nothing to show. */}
        {filteredProjects.length === 0 ? (
          searchTerm ? (
            <EmptyState
              icon={<Search size={24} />}
              title={translateMessage('No projects match your search')}
              subtitle={translateMessage('Try a shorter term or clear the search.')}
              action={
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="min-h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-5 text-sm font-bold text-[var(--text)] transition-colors hover:bg-[var(--surface-3)]"
                >
                  {translateMessage('Clear search')}
                </button>
              }
            />
          ) : (
            <EmptyState
              icon={<Plus size={24} />}
              title={translateMessage('No projects yet')}
              subtitle={translateMessage('Projects you add here appear on the mobile app home screen.')}
              action={
                <button
                  type="button"
                  onClick={() => handleOpenModal()}
                  className="min-h-11 rounded-xl bg-primary px-5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-dark"
                >
                  {translateMessage('Add Project')}
                </button>
              }
            />
          )
        ) : null}
      </div>

      <AnimatePresence>
        {isModalOpen ? (
          <ProjectFormModal
            onClose={handleCloseModal}
            editingProject={editingProject}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
          />
        ) : null}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Project?"
        message="Are you sure you want to remove this project? This will immediately remove it from the mobile app."
        confirmText="Delete Project"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
