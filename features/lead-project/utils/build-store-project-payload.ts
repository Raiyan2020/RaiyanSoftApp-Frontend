import { LeadProjectDraft, QuestionAnswerPayload } from '../types/form-question.types';

export function answersToPayload(
  answersByQuestionId: LeadProjectDraft['answersByQuestionId']
): QuestionAnswerPayload[] {
  const payload: QuestionAnswerPayload[] = [];

  Object.entries(answersByQuestionId).forEach(([questionId, answer]) => {
    const formQuestionId = Number(questionId);

    if (typeof answer === 'string') {
      payload.push({
        form_question_id: formQuestionId,
        text_value: answer,
      });
      return;
    }

    if (typeof answer === 'number') {
      payload.push({
        form_question_id: formQuestionId,
        form_question_option_id: answer,
      });
    }
  });

  return payload;
}

export function buildStoreProjectFormData(draft: LeadProjectDraft): FormData {
  const formData = new FormData();
  formData.append('name', draft.name.trim());
  formData.append('color', draft.color);

  const answers = answersToPayload(draft.answersByQuestionId);
  answers.forEach((answer, index) => {
    formData.append(`answers[${index}][form_question_id]`, String(answer.form_question_id));

    if ('form_question_option_id' in answer) {
      formData.append(
        `answers[${index}][form_question_option_id]`,
        String(answer.form_question_option_id)
      );
    }

    if ('text_value' in answer) {
      formData.append(`answers[${index}][text_value]`, answer.text_value);
    }
  });

  return formData;
}
