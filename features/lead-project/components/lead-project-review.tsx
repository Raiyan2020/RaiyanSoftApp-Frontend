import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FormQuestion } from '../types/form-question.types';
import { resolveQuestionSection, ReviewSection } from '../utils/question-helpers';

interface LeadProjectReviewProps {
  questions: FormQuestion[];
  name: string;
  brandColor: string;
  answersByQuestionId: Record<number, number | string>;
  getAnswerLabel: (question: FormQuestion, answer: number | string) => string;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
  nameStep: number;
  colorStep: number;
  onEditStep: (step: number) => void;
}

type ReviewRow = {
  key: string;
  label: string;
  value: string;
  step: number;
};

export default function LeadProjectReview({
  questions,
  name,
  brandColor,
  answersByQuestionId,
  getAnswerLabel,
  t,
  dir,
  nameStep,
  colorStep,
  onEditStep,
}: LeadProjectReviewProps) {
  const answeredQuestionRows = questions.reduce<Record<ReviewSection, ReviewRow[]>>(
    (bySection, question, index) => {
      const answer = answersByQuestionId[question.id];
      if (answer === undefined) return bySection;

      const section = resolveQuestionSection(question);
      bySection[section].push({
        key: `question-${question.id}`,
        label: question.name,
        value: getAnswerLabel(question, answer),
        step: index + 1,
      });
      return bySection;
    },
    { basic: [], technical: [], business: [], branding: [] }
  );

  const sections: { title: string; rows: ReviewRow[] }[] = [
    {
      title: t('wizard.essentials'),
      rows: [
        { key: 'name', label: t('wizard.step_name'), value: name, step: nameStep },
        ...answeredQuestionRows.basic,
      ],
    },
    { title: t('wizard.config'), rows: answeredQuestionRows.technical },
    { title: t('wizard.biz_logic'), rows: answeredQuestionRows.business },
    {
      title: t('wizard.branding'),
      rows: [
        {
          key: 'color',
          label: t('wizard.step_color'),
          value: brandColor,
          step: colorStep,
        },
        ...answeredQuestionRows.branding,
      ],
    },
  ];

  const ChevronIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6 pt-10 pb-24 no-scrollbar">
      <h2 className="mb-6 text-2xl font-bold text-[var(--text)]">{t('wizard.review_title')}</h2>

      <div className="space-y-6">
        {sections.map((section) =>
          section.rows.length === 0 ? null : (
            <div key={section.title} className="space-y-2">
              <h3 className="text-sm font-bold text-[var(--text)]">{section.title}</h3>
              <div className="space-y-2">
                {section.rows.map((row) => (
                  <button
                    key={row.key}
                    type="button"
                    onClick={() => onEditStep(row.step)}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-3)] p-4 text-start transition-colors hover:border-primary/40"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-bold text-[var(--text-muted)]">{row.label}</span>
                      <span className="mt-1 block truncate text-sm font-bold text-[var(--text)]">
                        {row.value}
                      </span>
                    </span>
                    <ChevronIcon size={18} className="shrink-0 text-[var(--text-muted)]" />
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
