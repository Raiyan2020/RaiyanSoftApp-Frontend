import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProjects } from '@/lib/projectStore';
import { useTranslation } from '@/lib/i18nContext';
import ProjectListItem from './project-list-item';

export default function ProjectsListPage() {
  const router = useRouter();
  const { projects } = useProjects();
  const { t, dir } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
      className="app-page app-page-wide"
    >
      <header className="app-header">
        <div>
          <button
            type="button"
            onClick={() => router.push('/home')}
            className="text-[var(--text-muted)] hover:text-[var(--text)] mb-4 flex items-center gap-1"
          >
            {dir === 'rtl' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            <span className="text-sm">{t('auth.back')}</span>
          </button>
          <h1 className="app-title">{t('client_projects.title')}</h1>
          <p className="app-subtitle">{t('client_projects.subtitle')}</p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectListItem
              key={project.id}
              name={project.name}
              description={project.description}
              logoUrl={project.logoUrl}
              link={project.link}
            />
          ))
        ) : (
          <div className="sm:col-span-2 xl:col-span-3 text-center py-10 text-[var(--text-muted)]">
            <p>{t('client_projects.empty')}</p>
          </div>
        )}
      </div>

      <div className="mt-12 flex flex-col items-center justify-center opacity-70">
        <div className="h-1 w-12 bg-primary/50 rounded-full mb-3" />
        <p className="text-[var(--text-muted)] text-sm font-medium">{t('client_projects.coming_soon')}</p>
      </div>
    </motion.div>
  );
}
