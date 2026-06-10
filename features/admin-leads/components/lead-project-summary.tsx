import React from 'react';
import { useTranslation } from '@/lib/i18nContext';
import { AdminLeadAnswer } from '../types/admin-lead.types';

interface LeadProjectSummaryProps {
  projectName: string;
  color: string;
  description: string;
  answers?: AdminLeadAnswer[];
  /**
   * Controls which section to render:
   * - undefined / not passed → renders everything (backward compat)
   * - false → renders only the meta block (name, color, description)
   * - true  → renders only the answers block
   */
  answersSection?: boolean;
}

export default function LeadProjectSummary({
  projectName,
  color,
  description,
  answers,
  answersSection,
}: LeadProjectSummaryProps) {
  const { t } = useTranslation();
  const answerList = Array.isArray(answers) ? answers : [];

  const showMeta = answersSection === undefined || answersSection === false;
  const showAnswers = answersSection === undefined || answersSection === true;

  return (
    <div className="space-y-4">
      {showMeta ? (
        <>
          <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider border-b border-[var(--border)] pb-2">
            {t('admin.leads.project_details')}
          </h3>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-[var(--surface-3)] p-3 rounded-lg">
              <span className="text-[var(--text-muted)] block text-xs mb-1">{t('admin.leads.project_name')}</span>
              <span className="text-[var(--text)] font-medium">{projectName}</span>
            </div>
            <div className="bg-[var(--surface-3)] p-3 rounded-lg">
              <span className="text-[var(--text-muted)] block text-xs mb-1">{t('admin.leads.brand_color')}</span>
              <div className="flex items-center gap-2">
                <span
                  className="h-5 w-5 rounded-full border border-[var(--border)] shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="font-mono text-[var(--text)] text-xs">{color}</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--surface-3)] p-4 rounded-lg">
            <span className="text-[var(--text-muted)] block text-xs mb-2">{t('admin.leads.summary')}</span>
            <p className="text-[var(--text)] leading-relaxed text-sm">{description}</p>
          </div>
        </>
      ) : null}

      {showAnswers && answerList.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border)] pb-2">
            {t('admin.leads.answers')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {answerList.map((answer) => (
              <div key={answer.id} className="bg-[var(--surface-3)] p-3 rounded-lg">
                <span className="text-[var(--text-muted)] block text-xs mb-1">{answer.question}</span>
                <span className="text-[var(--text)] text-sm font-medium">{answer.answer || answer.text_value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
