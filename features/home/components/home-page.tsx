import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Box, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import Avatar from '@/components/ui/avatar';
import EmptyState from '@/components/ui/empty-state';
import { ProjectWizard } from '@/features/projects';
import { useTranslation } from '@/lib/i18nContext';
import { useHome } from '../hooks/use-home';
import AppCard from './app-card';

export default function HomePage() {
  const router = useRouter();
  const { t, dir } = useTranslation();
  const {
    currentUser,
    userName,
    projects,
    projectsLoading,
    projectsError,
    isWizardOpen,
    setIsWizardOpen,
    handleCreateClick,
    handleNotificationsClick,
  } = useHome();

  return (
    <div className="app-page app-page-wide">
      <header className="app-header">
        <div>
          <p className="text-sm font-semibold text-primary mb-2">{t('home.greeting')}, {userName}</p>
          <h1 className="app-title">{t('home.my_apps')}</h1>
          <p className="app-subtitle">{projects.length > 0 ? t('home.create_another') : t('home.create_first')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNotificationsClick}
            className="w-11 h-11 bg-[var(--surface)] rounded-full flex items-center justify-center border border-[var(--border)] text-[var(--text)] shadow-sm"
            aria-label={t('notif.title')}
          >
            <Bell size={20} />
          </motion.button>

          {currentUser ? (
            <div className="flex items-center gap-3 bg-[var(--surface)] ps-4 pe-1 py-1 rounded-full border border-[var(--border)] shadow-sm">
              <span className="text-sm font-medium text-[var(--text)]">{userName}</span>
              <div className="w-9 h-9 rounded-full border-2 border-primary/30 overflow-hidden shrink-0">
                <Avatar name={userName} size="sm" className="w-full h-full text-xs" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="px-4 py-2 text-xs font-semibold text-[var(--text)] bg-[var(--surface)] border border-[var(--border)] rounded-xl transition-all hover:bg-[var(--surface-2)]"
              >
                {t('auth.login_action')}
              </button>
              <button
                type="button"
                onClick={() => router.push('/signup')}
                className="px-4 py-2 text-xs font-semibold text-[var(--text)] bg-primary hover:bg-primary/80 rounded-xl transition-all shadow-[0_0_15px_rgba(29,183,240,0.3)]"
              >
                {t('auth.signup_action')}
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projectsLoading ? (
              <div className="sm:col-span-2 xl:col-span-3">
                <EmptyState
                  icon={<Box size={24} />}
                  title={dir === 'rtl' ? 'جاري تحميل المشاريع...' : 'Loading projects...'}
                  subtitle={t('home.create_first')}
                />
              </div>
            ) : projectsError ? (
              <div className="sm:col-span-2 xl:col-span-3">
                <EmptyState
                  icon={<Box size={24} />}
                  title={projectsError}
                  subtitle={t('project.back_home')}
                />
              </div>
            ) : projects.length > 0 ? (
              projects.map((app) => (
                <AppCard
                  key={app.id}
                  id={app.id}
                  name={app.name}
                  version={app.version || 'v1.0.0'}
                  description={app.description}
                  iconBg={app.iconBg}
                  brandColor={app.brandColor}
                  onOpen={() => router.push(`/projects/${app.id}`)}
                />
              ))
            ) : (
              <div className="sm:col-span-2 xl:col-span-3">
                <EmptyState
                  icon={<Plus size={24} />}
                  title={t('home.no_apps')}
                  subtitle={t('home.create_first')}
                />
              </div>
            )}
          </div>
        </section>

        <motion.button
          onClick={handleCreateClick}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="min-h-[12rem] bg-gradient-to-br from-primary to-blue-500 rounded-2xl p-6 flex flex-col items-start justify-between shadow-[0_0_20px_rgba(29,183,240,0.22)] group text-start"
        >
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Plus size={26} className="text-[var(--text)]" />
          </div>
          <div className="flex w-full items-end justify-between gap-4">
            <span className="text-[var(--text)] text-lg font-semibold">
              {projects.length > 0 ? t('home.create_another') : t('home.add_first')}
            </span>
            {dir === 'rtl' ? (
              <ChevronLeft className="text-[var(--text)]/70 group-hover:-translate-x-1 transition-transform shrink-0" />
            ) : (
              <ChevronRight className="text-[var(--text)]/70 group-hover:translate-x-1 transition-transform shrink-0" />
            )}
          </div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isWizardOpen ? (
          <ProjectWizard
            onClose={() => setIsWizardOpen(false)}
            onComplete={() => router.push('/profile?tab=project')}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
