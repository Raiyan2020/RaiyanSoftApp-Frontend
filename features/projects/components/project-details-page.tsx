import React from 'react';
import { ChevronLeft, ChevronRight, Box, Globe, ExternalLink } from 'lucide-react';
import EmptyState from '@/components/ui/empty-state';
import Button from '@/components/ui/button';
import ProjectHeader from './project-header';
import ProjectStatusCard from './project-status-card';
import ProjectInfoGrid from './project-info-grid';
import { useProjectDetails } from '../hooks/use-project-details';

export default function ProjectDetailsPage({ id }: { id?: string }) {
  const {
    router,
    t,
    dir,
    language,
    project,
    loading,
    error,
    handleOpenUrl,
  } = useProjectDetails(id);

  if (loading) {
    return (
      <div className="app-page app-page-narrow flex min-h-[60vh] items-center justify-center text-center text-[var(--text-muted)]">
        <EmptyState
          icon={<Box size={24} />}
          title={dir === 'rtl' ? 'جاري تحميل المشروع...' : 'Loading project...'}
          subtitle={t('project.details')}
        />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="app-page app-page-narrow flex min-h-[60vh] items-center justify-center text-center text-[var(--text-muted)]">
        <EmptyState
          icon={<Box size={24} />}
          title={error || t('project.not_found')}
          subtitle={t('project.removed')}
          action={
            <Button onClick={() => router.push('/home')} className="mt-4">
              {t('project.back_home')}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="app-page app-page-wide">
      <header className="app-header">
        <div>
          <button
            type="button"
            onClick={() => router.push('/home')}
            className="text-[var(--text-muted)] hover:text-[var(--text)] mb-4 flex items-center gap-1"
          >
            {dir === 'rtl' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            <span className="text-sm font-medium">{t('auth.back')}</span>
          </button>
          <h1 className="app-title">{t('project.details')}</h1>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <div className="space-y-6">
        <ProjectHeader
          name={project.name}
          version={project.version}
          brandColor={project.brandColor}
          projectUrl={project.projectUrl}
          isEditingName={false}
          nameDraft={project.name}
          t={t}
          onOpenUrl={handleOpenUrl}
          onStartEditName={() => {}}
          onChangeNameDraft={() => {}}
          onSaveName={() => {}}
          onCancelEditName={() => {}}
          canEdit={false}
        />

        <ProjectStatusCard
          estimatedPrice={project.estimatedPrice}
          estimatedDuration={project.estimatedDuration}
          status={project.status}
          statusLabel={project.statusLabel}
          t={t}
          language={language}
        />
        </div>

        <div className="space-y-6">
        <ProjectInfoGrid
          industry={project.industry}
          industryOther={project.industryOther}
          markets={project.markets}
          languages={project.languages}
          platforms={project.platforms}
          t={t}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[var(--text)] font-bold text-base">{t('project.desc_title')}</h3>
          </div>

          <div className="app-card rounded-2xl p-4 min-h-[120px]">
            <p className="text-[var(--text-muted)] text-sm leading-relaxed whitespace-pre-wrap">{project.description || '-'}</p>
          </div>
        </div>

        {project.projectUrl ? (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 app-card rounded-2xl hover:border-primary/40 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Globe size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[var(--text)]">{t('project.visit_web')}</span>
                <span className="text-xs text-[var(--text-muted)] truncate max-w-[200px]">{project.projectUrl}</span>
              </div>
            </div>
            <ExternalLink size={18} className="text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors" />
          </a>
        ) : null}
        </div>
      </div>
    </div>
  );
}
