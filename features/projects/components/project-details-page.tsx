'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, FileText, Globe, LayoutGrid, ListChecks } from 'lucide-react';
import EmptyState from '@/components/ui/empty-state';
import Button from '@/components/ui/button';
import FallbackImage from '@/components/ui/fallback-image';
import Badge from '@/components/ui/badge';
import ClampText from '@/components/ui/clamp-text';
import { useProjectDetails } from '../hooks/use-project-details';
import type { UserProjectStage } from '@/features/lead-project';
import type { ClientProjectPhase, ClientProjectReport } from '../types';
import { getIntlLocale } from '@/lib/language';

type T = (key: string) => string;

const BACK_HREF = '/profile?tab=project';

// Same surface as the /profile cards.
const card = 'rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-5';
const cardTitle = 'text-base font-bold text-[var(--text)]';
const container = 'mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8';

const stageStatusClasses: Record<string, string> = {
  planned: 'bg-slate-500/10 text-[var(--text)] border-slate-500/20',
  active: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-[color-mix(in_srgb,var(--success)_10%,transparent)] text-success border-[color-mix(in_srgb,var(--success)_20%,transparent)]',
  blocked: 'bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-danger border-[color-mix(in_srgb,var(--danger)_20%,transparent)]',
};

// Mirrors the status tone of the /profile project list.
function statusTone(status: string) {
  const lower = status.toLowerCase();
  if (lower.includes('رفض') || lower.includes('reject') || lower.includes('cancel')) return 'error' as const;
  if (lower.includes('قبول') || lower.includes('approv') || lower.includes('complet')) return 'success' as const;
  return 'warning' as const;
}

const formatDate = (value: number | null | undefined, dir: string) =>
  value
    ? new Date(value).toLocaleDateString(getIntlLocale(dir === 'rtl' ? 'ar' : 'en'), { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

const clamp = (value: number) => Math.max(0, Math.min(100, value));

const capitalize = (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : value);

function BackLink({ t, dir }: { t: T; dir: string }) {
  return (
    <Link
      href={BACK_HREF}
      className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
    >
      {dir === 'rtl' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      {t('Back to projects')}
    </Link>
  );
}

function StatCard({ label, value, children }: { label: string; value?: string | null; children?: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <p className="text-xs font-bold text-[var(--text-muted)]">{label}</p>
      <div className="mt-1.5 truncate text-base font-bold text-[var(--text)]">
        {children ?? (value ? value : <span className="font-medium text-[var(--text-muted)]">—</span>)}
      </div>
    </div>
  );
}

function StepsCard({ stages, t, dir }: { stages: UserProjectStage[]; t: T; dir: string }) {
  const sorted = stages.slice().sort((a, b) => a.order - b.order);
  const done = stages.filter((stage) => stage.status === 'completed').length;

  return (
    <section className={card}>
      <div className="flex items-center justify-between gap-3">
        <h2 className={cardTitle}>{t('Steps')}</h2>
        {stages.length > 0 ? (
          <span className="text-xs text-[var(--text-muted)]">
            {t('{done} of {total} completed').replace('{done}', String(done)).replace('{total}', String(stages.length))}
          </span>
        ) : null}
      </div>

      {sorted.length > 0 ? (
        <ol className="mt-4 space-y-3">
          {sorted.map((stage) => (
            <li key={stage.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="min-w-0 text-sm font-bold text-[var(--text)]">{stage.title}</h3>
                <Badge className={stageStatusClasses[stage.status] || ''}>{t(capitalize(stage.status))}</Badge>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">
                {stage.description || t('No description added for this step.')}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-[var(--surface)]">
                  <div className="h-1.5 rounded-full bg-primary" style={{ width: `${clamp(stage.progress)}%` }} />
                </div>
                <span className="text-xs font-semibold text-[var(--text)]">{clamp(stage.progress)}%</span>
              </div>
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--text-muted)]">
                <span>{stage.assignedTo || t('Unassigned')}</span>
                <span>
                  {t('Updated')} {formatDate(stage.updatedAt, dir)}
                </span>
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState
          icon={<ListChecks size={22} />}
          title={t('No steps yet')}
          subtitle={t('Project steps will appear here once the team adds them.')}
        />
      )}
    </section>
  );
}

function ReportsCard({ reports, t, dir }: { reports: ClientProjectReport[]; t: T; dir: string }) {
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const selectedReport = reports.find((report) => report.id === selectedReportId) || null;

  return (
    <section className={card}>
      <div className="flex items-center justify-between gap-3">
        <h2 className={cardTitle}>{t('Reports')}</h2>
        {reports.length > 0 ? <span className="text-xs text-[var(--text-muted)]">{reports.length}</span> : null}
      </div>

      {selectedReport ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setSelectedReportId(null)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            {dir === 'rtl' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {t('Back to reports list')}
          </button>
          <article className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
            <h3 className="text-sm font-bold text-[var(--text)]">{selectedReport.title || t('Project report')}</h3>
            {selectedReport.date ? <p className="mt-1 text-xs text-[var(--text-muted)]">{selectedReport.date}</p> : null}
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-muted)]">
              {selectedReport.reportText || t('No report content yet.')}
            </p>
          </article>
        </div>
      ) : reports.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {reports.map((report) => (
            <li key={report.id}>
              <button
                type="button"
                onClick={() => setSelectedReportId(report.id)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-start transition-colors hover:border-primary/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[var(--text)]">{report.title || t('Project report')}</span>
                  {report.date ? <Badge>{report.date}</Badge> : null}
                </div>
                {report.summary ? <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">{report.summary}</p> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<FileText size={22} />}
          title={t('No reports yet')}
          subtitle={t('Weekly updates will appear here once they are created.')}
        />
      )}
    </section>
  );
}

function PhaseCard({ phase, rejectionReason, t }: { phase: ClientProjectPhase | null; rejectionReason: string | null; t: T }) {
  if (!phase && !rejectionReason) return null;

  return (
    <section className={`${card} space-y-4`}>
      {phase ? (
        <div>
          <p className="text-xs font-bold text-[var(--text-muted)]">{t('Current delivery phase')}</p>
          <Badge variant="info" className="mt-2">{phase.name || phase.value}</Badge>
        </div>
      ) : null}
      {rejectionReason ? (
        <div>
          <p className="text-xs font-bold text-[var(--text-muted)]">{t('Cancellation reason')}</p>
          <p className="mt-2 rounded-xl border border-[color-mix(in_srgb,var(--danger)_20%,transparent)] bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] px-3 py-2 text-sm text-danger">
            {rejectionReason}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-[var(--surface-2)] ${className}`} />;
}

function LoadingSkeleton({ t, dir }: { t: T; dir: string }) {
  return (
    <div className={container} aria-busy="true">
      <span className="sr-only">{t('Loading project...')}</span>
      <div className="mb-6 border-b border-[var(--border)] pb-5 sm:mb-8 sm:pb-6">
        <BackLink t={t} dir={dir} />
        <Pulse className="mt-4 h-8 w-2/3 max-w-sm" />
        <Pulse className="mt-3 h-5 w-40" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((key) => (
          <Pulse key={key} className="h-20 rounded-2xl" />
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
        <div className="space-y-6">
          <Pulse className="h-40 rounded-2xl" />
          <Pulse className="h-64 rounded-2xl" />
        </div>
        <div className="space-y-6">
          <Pulse className="h-56 rounded-2xl" />
          <Pulse className="h-40 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailsPage({ id }: { id?: string }) {
  const { router, t, dir, project, extras, loading, error, handleOpenUrl } = useProjectDetails(id);

  if (loading) return <LoadingSkeleton t={t} dir={dir} />;

  if (!project) {
    return (
      <div className={container}>
        <div className="mb-6 border-b border-[var(--border)] pb-5 sm:mb-8 sm:pb-6">
          <BackLink t={t} dir={dir} />
        </div>
        <div className={`${card} flex min-h-[40vh] items-center justify-center text-center`}>
          <EmptyState
            icon={<LayoutGrid size={24} />}
            title={error || t('project.not_found')}
            subtitle={t('project.removed')}
            action={
              <Button onClick={() => router.push(BACK_HREF)} className="mt-4">
                {t('Back to projects')}
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const statusKey = `status.${project.status}`;
  const translatedStatus = t(statusKey);
  const displayStatus = translatedStatus === statusKey ? project.statusLabel || project.status : translatedStatus;
  // version is request_id, or a 'v1.0.0' placeholder when the API sent none.
  const requestId = project.version && project.version !== 'v1.0.0' ? project.version : `#${project.id}`;
  const stages = project.stages || [];
  const progress = stages.length
    ? Math.round(stages.reduce((sum, stage) => sum + clamp(stage.progress), 0) / stages.length)
    : null;

  const answerGroups = Object.entries(
    project.answers.reduce<Record<string, string[]>>((acc, answer) => {
      const key = answer.question || `Q${answer.form_question_id}`;
      if (!acc[key]) acc[key] = [];
      if (answer.answer && !acc[key].includes(answer.answer)) acc[key].push(answer.answer);
      return acc;
    }, {})
  );

  return (
    <div className={container}>
      <header className="mb-6 border-b border-[var(--border)] pb-5 sm:mb-8 sm:pb-6">
        <BackLink t={t} dir={dir} />
        <h1 className="mt-3 break-words text-2xl font-extrabold tracking-tight text-[var(--text)] sm:text-3xl">{project.name}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
          {displayStatus ? <Badge variant={statusTone(displayStatus)}>{displayStatus}</Badge> : null}
          <span>
            {t('Request ID')}: <span dir="ltr" className="font-semibold text-[var(--text)]">{requestId}</span>
          </span>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label={t('project.est_price')}
          value={project.estimatedPrice ? `${project.estimatedPrice.toLocaleString()} ${t('KWD')}` : null}
        />
        <StatCard
          label={t('project.duration')}
          value={project.estimatedDuration ? `${project.estimatedDuration} ${t('days')}` : null}
        />
        <StatCard label={t('project.status')} value={displayStatus} />
        <StatCard label={t('Progress')}>
          {progress === null ? null : (
            <div className="flex items-center gap-2">
              <span>{progress}%</span>
              <div className="h-1.5 flex-1 rounded-full bg-[var(--surface-2)]">
                <div className="h-1.5 rounded-full bg-primary" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </StatCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
        <div className="min-w-0 space-y-6">
          <section className={card}>
            <h2 className={cardTitle}>{t('project.desc_title')}</h2>
            {project.description ? (
              <ClampText lines={4} className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--text-muted)]">
                {project.description}
              </ClampText>
            ) : (
              <p className="mt-3 text-sm text-[var(--text-muted)]">{t('No description yet.')}</p>
            )}
          </section>

          <section className={card}>
            <div className="flex items-center justify-between gap-3">
              <h2 className={cardTitle}>{t('Answers')}</h2>
              {answerGroups.length > 0 ? <span className="text-xs text-[var(--text-muted)]">{answerGroups.length}</span> : null}
            </div>
            {answerGroups.length > 0 ? (
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {answerGroups.map(([question, answers]) => (
                  <div key={question} className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
                    <dt className="text-sm font-semibold text-[var(--text)]">{question}</dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {answers.length > 0 ? (
                        answers.map((answer) => (
                          <Badge key={answer} className="max-w-full !whitespace-normal text-start text-[11px] leading-snug">
                            {answer}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-[var(--text-muted)]">—</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] px-4 py-6 text-sm text-[var(--text-muted)]">
                {t('No answers available yet.')}
              </p>
            )}
          </section>
        </div>

        <aside className="min-w-0 space-y-6">
          <section className={card}>
            <FallbackImage
              src={project.image}
              alt={project.name}
              className="aspect-video w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] object-contain"
            />
            {project.projectUrl ? (
              <button
                type="button"
                onClick={handleOpenUrl}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition-colors hover:border-primary/30 hover:text-primary"
              >
                <Globe size={16} />
                {t('project.visit_web')}
              </button>
            ) : null}
          </section>

          <PhaseCard phase={extras.phase} rejectionReason={extras.rejectionReason} t={t} />
          <StepsCard stages={stages} t={t} dir={dir} />
          <ReportsCard reports={extras.reports} t={t} dir={dir} />
        </aside>
      </div>
    </div>
  );
}
