import React from 'react';
import { FormQuestion } from '../types/form-question.types';

interface LeadProjectReviewProps {
  questions: FormQuestion[];
  name: string;
  brandColor: string;
  answersByQuestionId: Record<number, number | number[] | string>;
  getAnswerLabel: (question: FormQuestion, answer: number | number[] | string) => string;
  t: (key: string) => string;
}

export default function LeadProjectReview({
  questions,
  name,
  brandColor,
  answersByQuestionId,
  getAnswerLabel,
  t,
}: LeadProjectReviewProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-6 pt-10 pb-24 no-scrollbar">
      <h2 className="mb-6 text-2xl font-bold text-[var(--text)]">{t('wizard.review_title')}</h2>

      <div className="space-y-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-3)] p-4">
          <p className="text-xs font-bold text-[var(--text-muted)]">{t('wizard.step_name')}</p>
          <p className="mt-1 text-sm font-bold text-[var(--text)]">{name}</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-3)] p-4">
          <p className="text-xs font-bold text-[var(--text-muted)]">{t('wizard.step_color')}</p>
          <div className="mt-2 flex items-center gap-3">
            <span
              className="h-8 w-8 rounded-full border border-[var(--border)]"
              style={{ backgroundColor: brandColor }}
            />
            <span className="font-mono text-sm text-[var(--text)]">{brandColor}</span>
          </div>
        </div>

        {questions.map((question) => {
          const answer = answersByQuestionId[question.id];
          if (answer === undefined) return null;

          return (
            <div
              key={question.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-3)] p-4"
            >
              <p className="text-xs font-bold text-[var(--text-muted)]">{question.name}</p>
              <p className="mt-1 text-sm font-bold text-[var(--text)]">
                {getAnswerLabel(question, answer)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
