'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Box, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import Avatar from '@/components/ui/avatar';
import EmptyState from '@/components/ui/empty-state';
import Button from '@/components/ui/button';
import { LeadProjectWizard } from '@/features/lead-project';
import { useTranslation } from '@/lib/i18nContext';
import { translateMessage } from '@/lib/i18n-utils';
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
                className="min-h-9 px-4 py-2 text-xs font-bold text-[var(--text)] bg-[var(--surface)] border border-[var(--border)] rounded-xl transition-colors hover:bg-[var(--surface-2)]"
              >
                {t('auth.login_action')}
              </button>
              <button
                type="button"
                onClick={() => router.push('/signup')}
                className="min-h-9 px-4 py-2 text-xs font-bold text-on-primary bg-primary hover:bg-primary-dark rounded-xl transition-colors"
              >
                {t('auth.signup_action')}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* One create action, not two. The screen previously ran a standing
          gradient CTA in its own column *beside* an empty state that offered
          the same action, and repeated `home.create_first` as the page
          subtitle, the empty-state subtitle and the loading subtitle - the
          same sentence three times. The action now lives inside the empty
          state when there is nothing yet, and as the trailing tile of the
          grid once projects exist. */}
      <section>
        {projectsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-live="polite">
            <span className="sr-only">{translateMessage('Loading projects...')}</span>
            {[0, 1, 2].map((key) => (
              <div
                key={key}
                className="min-h-[11rem] animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]"
              />
            ))}
          </div>
        ) : projectsError ? (
          <EmptyState
            icon={<Box size={24} />}
            title={translateMessage("We couldn't load your projects")}
            subtitle={projectsError}
            action={
              <Button variant="outline" onClick={() => window.location.reload()}>
                {translateMessage('Try again')}
              </Button>
            }
          />
        ) : projects.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((app) => (
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
            ))}
            <motion.button
              onClick={handleCreateClick}
              whileTap={{ scale: 0.98 }}
              className="group flex min-h-[11rem] flex-col items-start justify-between rounded-2xl border border-dashed border-primary/40 bg-primary/[0.06] p-6 text-start transition-colors hover:border-primary hover:bg-primary/10"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-primary">
                <Plus size={24} />
              </span>
              <span className="flex w-full items-end justify-between gap-4">
                <span className="text-base font-bold text-[var(--text)]">{t('home.create_another')}</span>
                {dir === 'rtl' ? (
                  <ChevronLeft size={20} className="shrink-0 text-primary transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ChevronRight size={20} className="shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                )}
              </span>
            </motion.button>
          </div>
        ) : (
          <EmptyState
            icon={<Plus size={24} />}
            title={t('home.no_apps')}
            subtitle={t('home.create_first')}
            className="py-14"
            action={<Button onClick={handleCreateClick}>{t('home.add_first')}</Button>}
          />
        )}
      </section>

      <AnimatePresence>
        {isWizardOpen ? (
          <LeadProjectWizard
            onClose={() => setIsWizardOpen(false)}
            onComplete={() => router.push('/profile?tab=project')}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
