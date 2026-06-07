import { FormQuestion, FormQuestionType } from '../types/form-question.types';

/** Questions that accept multiple option answers (same form_question_id repeated). */
const MULTI_SELECT_QUESTION_IDS = new Set([1, 2, 3]);

function isYesNoQuestion(question: FormQuestion) {
  if (question.options.length !== 2) return false;
  const normalized = question.options.map((option) => option.value.trim().toLowerCase());
  return (
    (normalized.includes('نعم') && normalized.includes('لا')) ||
    (normalized.includes('yes') && normalized.includes('no'))
  );
}

export function resolveQuestionType(question: FormQuestion): FormQuestionType {
  if (question.type) return question.type;
  if (question.options.length === 0) return 'text';
  if (MULTI_SELECT_QUESTION_IDS.has(question.id)) return 'multi_select';
  if (isYesNoQuestion(question)) return 'single_select';
  return 'single_select';
}

export function isQuestionAnswered(
  question: FormQuestion,
  answersByQuestionId: Record<number, number | number[] | string>
): boolean {
  const answer = answersByQuestionId[question.id];
  const type = resolveQuestionType(question);

  if (type === 'text') {
    return typeof answer === 'string' && answer.trim().length > 0;
  }

  if (type === 'multi_select') {
    return Array.isArray(answer) && answer.length > 0;
  }

  return typeof answer === 'number';
}
