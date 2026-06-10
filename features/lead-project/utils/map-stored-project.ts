import { StoredProject } from '../types/form-question.types';

export type UserProjectStage = {
  id: string;
  title: string;
  description?: string;
  assignedTo?: string;
  estimatedDays?: number | null;
  order: number;
  progress: number;
  status: string;
  createdAt: number;
  updatedAt: number;
  startedAt?: number | null;
  completedAt?: number | null;
};

export type UserProjectWeeklyReport = {
  id: string;
  weekStart: number;
  weekEnd: number;
  content: string;
  status: 'draft' | 'sent';
  sourceUpdateIds: string[];
  clientVisible: boolean;
  createdAt: number;
  updatedAt: number;
  createdByName?: string;
  sentAt?: number | null;
};

export type UserProjectView = {
  id: string;
  name: string;
  description: string;
  estimatedPrice: number | null;
  estimatedDuration: number | null;
  status: string;
  statusLabel: string;
  projectUrl: string | null;
  version: string;
  iconBg: string;
  brandColor: string;
  industry: string;
  industryOther: string | null;
  markets: string[];
  languages: string[];
  platforms: string[];
  answers: Array<{
    id: number;
    question: string;
    answer: string;
    form_question_id: number;
    form_question_option_id: number | null;
  }>;
  stages: UserProjectStage[];
  weeklyReports: UserProjectWeeklyReport[];
};

function buildDescription(project: StoredProject) {
  if (project.description?.trim()) return project.description;

  const answers = project.answers || [];
  if (!answers.length) return '';

  return answers
    .map((answer) => `${answer.question}: ${answer.answer}`)
    .filter(Boolean)
    .join('\n');
}

export function mapStoredProject(project: StoredProject): UserProjectView {
  const color = project.color || '#1DB7F0';
  const statusLabel = String(project.status || '');
  const extraProject = project as StoredProject & {
    stages?: Array<Partial<UserProjectStage> & { id?: string | number }>;
    weeklyReports?: Array<Partial<UserProjectWeeklyReport> & { id?: string | number }>;
  };

  return {
    id: String(project.id),
    name: project.project_name || `Project #${project.id}`,
    description: buildDescription(project),
    estimatedPrice: null,
    estimatedDuration: null,
    status: statusLabel,
    statusLabel,
    projectUrl: null,
    version: project.request_id || 'v1.0.0',
    iconBg: color,
    brandColor: color,
    industry: '',
    industryOther: null,
    markets: [],
    languages: [],
    platforms: [],
    answers: (project.answers || []).map((answer) => ({
      id: answer.id,
      question: answer.question,
      answer: answer.answer,
      form_question_id: answer.form_question_id,
      form_question_option_id: answer.form_question_option_id ?? null,
    })),
    stages: (extraProject.stages || []).map((stage, index) => ({
      id: String(stage.id ?? `stage-${index}`),
      title: stage.title || `Step ${index + 1}`,
      description: stage.description || '',
      assignedTo: stage.assignedTo || '',
      estimatedDays: stage.estimatedDays ?? null,
      order: stage.order ?? index + 1,
      progress: stage.progress ?? 0,
      status: stage.status || 'planned',
      createdAt: stage.createdAt ?? Date.now(),
      updatedAt: stage.updatedAt ?? Date.now(),
      startedAt: stage.startedAt ?? null,
      completedAt: stage.completedAt ?? null,
    })),
    weeklyReports: (extraProject.weeklyReports || []).map((report, index) => ({
      id: String(report.id ?? `report-${index}`),
      weekStart: report.weekStart ?? Date.now(),
      weekEnd: report.weekEnd ?? Date.now(),
      content: report.content || '',
      status: report.status === 'sent' ? 'sent' : 'draft',
      sourceUpdateIds: report.sourceUpdateIds || [],
      clientVisible: Boolean(report.clientVisible),
      createdAt: report.createdAt ?? Date.now(),
      updatedAt: report.updatedAt ?? Date.now(),
      createdByName: report.createdByName || 'Team',
      sentAt: report.sentAt ?? null,
    })),
  };
}
