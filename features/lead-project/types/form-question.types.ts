export type FormQuestionOption = {
  id: number;
  value: string;
};

export type FormQuestionType = 'single_select' | 'text';

export type FormQuestion = {
  id: number;
  name: string;
  options: FormQuestionOption[];
  type?: FormQuestionType;
};

export type QuestionAnswerPayload =
  | { form_question_id: number; form_question_option_id: number }
  | { form_question_id: number; text_value: string };

export type LeadProjectDraft = {
  name: string;
  color: string;
  answersByQuestionId: Record<number, number | string>;
};

export type StoredProjectAnswer = {
  id: number;
  form_question_id: number;
  question: string;
  form_question_option_id?: number;
  answer: string;
  text_value?: string;
};

export type StoredProject = {
  id: number;
  project_name: string;
  color: string;
  status: string | number;
  request_id?: string;
  description?: string;
  answers?: StoredProjectAnswer[];
};
