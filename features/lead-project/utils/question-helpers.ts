import { FormQuestion, FormQuestionType } from '../types/form-question.types';

function isYesNoQuestion(question: FormQuestion) {
  if (question.options.length !== 2) return false;
  const normalized = question.options.map((option) => option.value.trim().toLowerCase());
  return (
    (normalized.includes('نعم') && normalized.includes('لا')) ||
    (normalized.includes('yes') && normalized.includes('no'))
  );
}

export function resolveQuestionType(question: FormQuestion): FormQuestionType {
  if (question.type === 'text') return 'text';
  if (question.options.length === 0) return 'text';
  if (isYesNoQuestion(question)) return 'single_select';
  return 'single_select';
}

export function isQuestionAnswered(
  question: FormQuestion,
  answersByQuestionId: Record<number, number | string>
): boolean {
  const answer = answersByQuestionId[question.id];
  const type = resolveQuestionType(question);

  if (type === 'text') {
    return typeof answer === 'string' && answer.trim().length > 0;
  }

  return typeof answer === 'number';
}
