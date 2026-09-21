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

export type ReviewSection = 'basic' | 'technical' | 'business' | 'branding';

// Fallback only: used for rows saved before the admin-assignable `section`
// column existed (F-ADMIN-LEAD-06, Wave 3). Once every question has a
// section set, this keyword match never runs.
const SECTION_KEYWORDS: Record<ReviewSection, string[]> = {
  basic: ['مجال', 'industry', 'domain'],
  technical: ['منصات', 'platform', 'لغات', 'language', 'أسواق', 'market'],
  business: [
    'دفع',
    'payment',
    'نشاط تجاري',
    'business',
    'تقديم الخدمة',
    'service',
    'أقرب',
    'closest',
    'reference',
  ],
  branding: [],
};

const API_SECTION_MAP: Record<string, ReviewSection> = {
  basics: 'basic',
  technical: 'technical',
  business: 'business',
  branding: 'branding',
};

/**
 * Groups a question into one of the review screen's four sections. Prefers
 * the admin-assigned `section` field from the API; falls back to matching
 * the question's wording for older rows saved before that field existed.
 */
export function resolveQuestionSection(question: FormQuestion): ReviewSection {
  if (question.section && API_SECTION_MAP[question.section]) {
    return API_SECTION_MAP[question.section];
  }

  const name = question.name.toLowerCase();
  const sections = Object.keys(SECTION_KEYWORDS) as ReviewSection[];

  for (const section of sections) {
    if (SECTION_KEYWORDS[section].some((keyword) => name.includes(keyword.toLowerCase()))) {
      return section;
    }
  }

  return 'business';
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
