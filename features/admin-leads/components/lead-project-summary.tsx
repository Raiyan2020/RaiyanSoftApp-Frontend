import React from 'react';
import { useTranslation } from '@/lib/i18nContext';
import { AdminLeadAnswer } from '../types/admin-lead.types';

interface LeadProjectSummaryProps {
  projectName: string;
  color: string;
  description: string;
  answers?: AdminLeadAnswer[];
}

export default function LeadProjectSummary({
  projectName,
  color,
  description,
  answers,
}: LeadProjectSummaryProps) {
  const { t } = useTranslation();
  const answerList = Array.isArray(answers) ? answers : [];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider border-b border-[var(--border)] pb-2">
        {t('admin.leads.project_details')}
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-[var(--surface-3)] p-3 rounded-lg">
          <span className="text-[var(--text-muted)] block text-xs mb-1">{t('admin.leads.project_name')}</span>
          <span className="text-[var(--text)]">{projectName}</span>
        </div>
        <div className="bg-[var(--surface-3)] p-3 rounded-lg">
          <span className="text-[var(--text-muted)] block text-xs mb-1">{t('admin.leads.brand_color')}</span>
          <div className="flex items-center gap-2">
            <span
              className="h-5 w-5 rounded-full border border-[var(--border)]"
              style={{ backgroundColor: color }}
            />
            <span className="font-mono text-[var(--text)]">{color}</span>
          </div>
        </div>
      </div>

      <div className="bg-[var(--surface-3)] p-4 rounded-lg">
        <span className="text-[var(--text-muted)] block text-xs mb-2">{t('admin.leads.summary')}</span>
        <p className="text-[var(--text)] leading-relaxed text-sm">{description}</p>
      </div>

      {answerList.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">{t('admin.leads.answers')}</h4>
          {answerList.map((answer) => (
            <div key={answer.id} className="bg-[var(--surface-3)] p-3 rounded-lg">
              <span className="text-[var(--text-muted)] block text-xs mb-1">{answer.question}</span>
              <span className="text-[var(--text)] text-sm">{answer.answer || answer.text_value}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
