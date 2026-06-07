import React from 'react';
import { Check } from 'lucide-react';
import { FormQuestion } from '../types/form-question.types';
import { resolveQuestionType } from '../utils/question-helpers';

interface ApiQuestionStepProps {
  question: FormQuestion;
  answer: number | number[] | string | undefined;
  onSelectSingle: (optionId: number) => void;
  onToggleMulti: (optionId: number) => void;
  onTextChange: (value: string) => void;
}

export default function ApiQuestionStep({
  question,
  answer,
  onSelectSingle,
  onToggleMulti,
  onTextChange,
}: ApiQuestionStepProps) {
  const type = resolveQuestionType(question);

  if (type === 'text') {
    return (
      <div className="flex h-full flex-col p-6 pt-10">
        <h2 className="mb-6 text-2xl font-bold text-[var(--text)]">{question.name}</h2>
        <textarea
          value={typeof answer === 'string' ? answer : ''}
          onChange={(event) => onTextChange(event.target.value)}
          rows={6}
          maxLength={1000}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-3)] px-4 py-4 text-[var(--text)] outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/50"
          placeholder={question.name}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6 pt-10 no-scrollbar">
      <h2 className="mb-6 text-2xl font-bold text-[var(--text)]">{question.name}</h2>
      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected =
            type === 'multi_select'
              ? Array.isArray(answer) && answer.includes(option.id)
              : answer === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                type === 'multi_select'
                  ? onToggleMulti(option.id)
                  : onSelectSingle(option.id)
              }
              className={`flex w-full items-center justify-between rounded-xl border p-4 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-[var(--border)] bg-[var(--surface-3)] text-[var(--text-muted)] hover:bg-[var(--surface-2)]'
              }`}
            >
              <span className="text-start text-lg font-medium">{option.value}</span>
              {isSelected ? <Check size={20} className="shrink-0 text-primary" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
