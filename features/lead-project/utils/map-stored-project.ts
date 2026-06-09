import { StoredProject } from '../types/form-question.types';

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
  };
}
