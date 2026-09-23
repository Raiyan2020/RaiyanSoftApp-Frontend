import { translateMessage } from './i18n-utils';
import type { AppLanguage } from './language';

const LABELS: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  remote: 'Remote',
};

/** Translated label for a job's employment_type key (shared by the dashboard and the public careers page). */
export function employmentTypeLabel(type: string, language: AppLanguage): string {
  return translateMessage(LABELS[type] ?? type, language);
}
