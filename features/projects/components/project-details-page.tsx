'use client';

import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock3, ExternalLink, FileText, Globe, LayoutGrid, ListChecks, MessageSquareText, Sparkles } from 'lucide-react';
import EmptyState from '@/components/ui/empty-state';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import ProjectHeader from './project-header';
import ProjectStatusCard from './project-status-card';
import ProjectInfoGrid from './project-info-grid';
import { useProjectDetails } from '../hooks/use-project-details';
import type { UserProjectStage, UserProjectWeeklyReport } from '@/features/lead-project';

type ProjectTab = 'overview' | 'steps' | 'reports';

const tabButtonBase =
  'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200';

const stageStatusClasses: Record<string, string> = {
  planned: 'bg-slate-500/10 text-[var(--text)] border-slate-500/20',
  active: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  blocked: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const formatDate = (value?: number | null) => {
  if (!value) return 'Not set';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const clamp = (value: number) => Math.max(0, Math.min(100, value));

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_10px_30px_rgba(8,38,58,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</p>
          <p className="mt-2 text-lg font-bold text-[var(--text)]">{value}</p>
          {hint ? <p className="mt-1 text-xs text-[var(--text-muted)]">{hint}</p> : null}
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function TimelineDot({ status }: { status: string }) {
  const dotClass =
    status === 'completed'
      ? 'bg-emerald-400'
      : status === 'blocked'
      ? 'bg-red-400'
      : status === 'active'
      ? 'bg-primary'
      : 'bg-slate-400';
  return <span className={`mt-1 h-3 w-3 rounded-full ring-4 ring-[var(--surface)] ${dotClass}`} />;
}

function OverviewSection({
  project,
  handleOpenUrl,
  t,
  language,
  dir,
}: {
  project: NonNullable<ReturnType<typeof useProjectDetails>['project']>;
  handleOpenUrl: () => void;
  t: ReturnType<typeof useProjectDetails>['t'];
  language: ReturnType<typeof useProjectDetails>['language'];
  dir: ReturnType<typeof useProjectDetails>['dir'];
}) {
  const answerGroups = project.answers.reduce<Record<string, string[]>>((acc, answer) => {
    const key = answer.question || `Q${answer.form_question_id}`;
    if (!acc[key]) acc[key] = [];
    if (answer.answer && !acc[key].includes(answer.answer)) acc[key].push(answer.answer);
    return acc;
  }, {});

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
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

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_10px_30px_rgba(8,38,58,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                {dir === 'rtl' ? 'وصف مختصر' : 'Project snapshot'}
              </p>
              <h3 className="mt-2 text-lg font-bold text-[var(--text)]">{project.name}</h3>
            </div>
            <div
              className="h-12 w-12 rounded-2xl"
              style={{ background: project.brandColor || project.iconBg || '#1DB7F0' }}
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)] whitespace-pre-wrap">
            {project.description || (dir === 'rtl' ? 'لا يوجد وصف بعد.' : 'No description yet.')}
          </p>
          {project.projectUrl ? (
            <button
              type="button"
              onClick={handleOpenUrl}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition-colors hover:border-primary/30 hover:text-primary"
            >
              <Globe size={16} />
              {dir === 'rtl' ? 'زيارة الرابط' : 'Visit website'}
            </button>
          ) : null}
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            icon={ListChecks}
            label={dir === 'rtl' ? 'الأسئلة' : 'Answers'}
            value={`${project.answers.length}`}
            hint={dir === 'rtl' ? 'بيانات الاستمارة المجمعة' : 'Collected form answers'}
          />
          <StatCard
            icon={Clock3}
            label={dir === 'rtl' ? 'المدة' : 'Timeline'}
            value={project.estimatedDuration ? `${project.estimatedDuration} days` : 'Open'}
            hint={dir === 'rtl' ? 'تقدير الزمن المتوقع' : 'Estimated delivery window'}
          />
        </div>

        <ProjectInfoGrid
          industry={project.industry}
          industryOther={project.industryOther}
          markets={project.markets}
          languages={project.languages}
          platforms={project.platforms}
          t={t}
        />

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_10px_30px_rgba(8,38,58,0.05)]">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-bold text-[var(--text)]">{dir === 'rtl' ? 'الإجابات' : 'Answers'}</h3>
          </div>
          <div className="mt-4 space-y-3">
            {Object.entries(answerGroups).length > 0 ? (
              Object.entries(answerGroups).map(([question, answers]) => (
                <div key={question} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                  <p className="text-sm font-semibold text-[var(--text)]">{question}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {answers.map((answer) => (
                      <Badge key={`${question}-${answer}`} className="text-[11px]">
                        {answer}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] px-4 py-6 text-sm text-[var(--text-muted)]">
                {dir === 'rtl' ? 'لا توجد إجابات بعد.' : 'No answers available yet.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepsSection({ stages, dir }: { stages: UserProjectStage[]; dir: string }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard
          icon={ListChecks}
          label={dir === 'rtl' ? 'عدد الخطوات' : 'Total steps'}
          value={`${stages.length}`}
          hint={dir === 'rtl' ? 'الخطوات الحالية للمشروع' : 'Current project steps'}
        />
        <StatCard
          icon={Sparkles}
          label={dir === 'rtl' ? 'مكتملة' : 'Completed'}
          value={`${stages.filter((stage) => stage.status === 'completed').length}`}
          hint={dir === 'rtl' ? 'الخطوات المنجزة' : 'Finished milestones'}
        />
        <StatCard
          icon={Clock3}
          label={dir === 'rtl' ? 'نشطة' : 'Active'}
          value={`${stages.filter((stage) => stage.status === 'active').length}`}
          hint={dir === 'rtl' ? 'الخطوات الجارية' : 'In progress now'}
        />
      </div>

      <div className="space-y-3">
        {stages.length > 0 ? (
          stages
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((stage, index) => (
              <div
                key={stage.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_10px_30px_rgba(8,38,58,0.05)]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 gap-3">
                    <TimelineDot status={stage.status} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-[var(--text)]">{stage.title}</h3>
                        <Badge className={stageStatusClasses[stage.status] || ''}>{stage.status}</Badge>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                        {stage.description || (dir === 'rtl' ? 'لا يوجد وصف لهذه الخطوة.' : 'No description added for this step.')}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
                        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1">
                          {dir === 'rtl' ? 'الترتيب' : 'Order'} {index + 1}
                        </span>
                        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1">
                          {stage.assignedTo || (dir === 'rtl' ? 'غير معين' : 'Unassigned')}
                        </span>
                        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1">
                          {stage.estimatedDays ? `${stage.estimatedDays} days` : (dir === 'rtl' ? 'بدون مدة' : 'No estimate')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-[11rem]">
                    <div className="mb-2 flex items-center justify-between text-xs text-[var(--text-muted)]">
                      <span>{dir === 'rtl' ? 'التقدم' : 'Progress'}</span>
                      <span className="font-semibold text-[var(--text)]">{clamp(stage.progress)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--surface-2)]">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${clamp(stage.progress)}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-[var(--text-muted)]">
                      {dir === 'rtl' ? 'آخر تحديث' : 'Updated'} {formatDate(stage.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <EmptyState
            icon={<ListChecks size={22} />}
            title={dir === 'rtl' ? 'لا توجد خطوات بعد' : 'No steps yet'}
            subtitle={dir === 'rtl' ? 'ستظهر هنا مراحل المشروع عندما يضيفها الفريق.' : 'Project steps will appear here once the team adds them.'}
          />
        )}
      </div>
    </div>
  );
}

function ReportsSection({ reports, dir }: { reports: UserProjectWeeklyReport[]; dir: string }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard
          icon={FileText}
          label={dir === 'rtl' ? 'إجمالي التقارير' : 'Total reports'}
          value={`${reports.length}`}
          hint={dir === 'rtl' ? 'التقارير الأسبوعية للمشروع' : 'Weekly project reports'}
        />
        <StatCard
          icon={MessageSquareText}
          label={dir === 'rtl' ? 'مرئية للعميل' : 'Client visible'}
          value={`${reports.filter((report) => report.clientVisible).length}`}
          hint={dir === 'rtl' ? 'تقارير يمكن للعميل قراءتها' : 'Reports visible to the client'}
        />
        <StatCard
          icon={Sparkles}
          label={dir === 'rtl' ? 'مرسلة' : 'Sent'}
          value={`${reports.filter((report) => report.status === 'sent').length}`}
          hint={dir === 'rtl' ? 'التقارير التي تم إرسالها' : 'Reports already sent'}
        />
      </div>

      <div className="space-y-3">
        {reports.length > 0 ? (
          reports
            .slice()
            .sort((a, b) => b.weekStart - a.weekStart)
            .map((report) => (
              <article
                key={report.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_10px_30px_rgba(8,38,58,0.05)]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-[var(--text)]">
                        {formatDate(report.weekStart)} - {formatDate(report.weekEnd)}
                      </h3>
                      <Badge className={report.status === 'sent' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}>
                        {report.status}
                      </Badge>
                      {report.clientVisible ? (
                        <Badge variant="info">Client visible</Badge>
                      ) : (
                        <Badge variant="neutral">{dir === 'rtl' ? 'داخلي' : 'Internal'}</Badge>
                      )}
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-muted)]">
                      {report.content || (dir === 'rtl' ? 'لا يوجد محتوى بعد.' : 'No report content yet.')}
                    </p>
                  </div>
                  <div className="min-w-[12rem] rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--text-muted)]">
                    <p className="font-semibold text-[var(--text)]">{report.createdByName || 'Team'}</p>
                    <p className="mt-1">{dir === 'rtl' ? 'أنشئ' : 'Created'} {formatDate(report.createdAt)}</p>
                    <p className="mt-1">{dir === 'rtl' ? 'أرسل' : 'Sent'} {formatDate(report.sentAt)}</p>
                  </div>
                </div>
              </article>
            ))
        ) : (
          <EmptyState
            icon={<FileText size={22} />}
            title={dir === 'rtl' ? 'لا توجد تقارير بعد' : 'No reports yet'}
            subtitle={dir === 'rtl' ? 'ستظهر تقارير المتابعة هنا.' : 'Weekly updates will appear here once they are created.'}
          />
        )}
      </div>
    </div>
  );
}

export default function ProjectDetailsPage({ id }: { id?: string }) {
  const { router, t, dir, language, project, loading, error, handleOpenUrl } = useProjectDetails(id);
  const [activeTab, setActiveTab] = useState<ProjectTab>('overview');

  const tabs = useMemo(
    () => [
      { id: 'overview' as const, label: dir === 'rtl' ? 'نظرة عامة' : 'Overview', icon: LayoutGrid },
      { id: 'steps' as const, label: dir === 'rtl' ? 'الخطوات' : 'Steps', icon: ListChecks },
      { id: 'reports' as const, label: dir === 'rtl' ? 'التقارير' : 'Reports', icon: FileText },
    ],
    [dir]
  );

  if (loading) {
    return (
      <div className="app-page app-page-narrow flex min-h-[60vh] items-center justify-center text-center text-[var(--text-muted)]">
        <EmptyState
          icon={<LayoutGrid size={24} />}
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
          icon={<LayoutGrid size={24} />}
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
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => router.push('/home')}
            className="text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1"
          >
            {dir === 'rtl' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            <span className="text-sm font-medium">{t('auth.back')}</span>
          </button>

          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_80px_rgba(8,38,58,0.08)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
                  <Sparkles size={13} />
                  {dir === 'rtl' ? 'لوحة المشروع' : 'Project dashboard'}
                </div>
                <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl">
                  {project.name}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-muted)]">
                  {project.description || (dir === 'rtl' ? 'عرض موجز للمشروع، والخطوات، والتقارير في تبويبات منفصلة.' : 'A cleaner home for your project details, steps, and reports in separate tabs.')}
                </p>
              </div>

              <div className="grid min-w-[18rem] gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{dir === 'rtl' ? 'الحالة' : 'Status'}</p>
                  <p className="mt-2 text-lg font-bold text-[var(--text)] capitalize">{project.statusLabel || project.status}</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{dir === 'rtl' ? 'النسخة' : 'Version'}</p>
                  <p className="mt-2 text-lg font-bold text-[var(--text)]">{project.version || 'v1.0.0'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-6 rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[0_18px_60px_rgba(8,38,58,0.06)]">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`${tabButtonBase} ${
                  active
                    ? 'border-primary/25 bg-primary/10 text-primary shadow-[0_10px_30px_rgba(29,183,240,0.1)]'
                    : 'border-transparent bg-[var(--surface-2)] text-[var(--text-muted)] hover:border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--text)]'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'overview' ? (
          <OverviewSection
            project={project}
            handleOpenUrl={handleOpenUrl}
            t={t}
            language={language}
            dir={dir}
          />
        ) : null}

        {activeTab === 'steps' ? <StepsSection stages={project.stages || []} dir={dir} /> : null}

        {activeTab === 'reports' ? <ReportsSection reports={project.weeklyReports || []} dir={dir} /> : null}
      </div>
    </div>
  );
}
