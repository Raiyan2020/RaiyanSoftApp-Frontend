"use client";

const STORAGE_KEY = 'rs_lead_project_wizard_draft';

export type LeadProjectWizardDraft = {
  step: number;
  name: string;
  brandColor: string;
  showCustomColor: boolean;
  answersByQuestionId: Record<number, number | string>;
};

const emptyDraft: LeadProjectWizardDraft = {
  step: 0,
  name: '',
  brandColor: '',
  showCustomColor: false,
  answersByQuestionId: {},
};

function canUseStorage() {
  return typeof window !== 'undefined';
}

export function loadLeadProjectDraft(): LeadProjectWizardDraft {
  if (!canUseStorage()) return emptyDraft;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyDraft;

    const parsed = JSON.parse(raw) as Partial<LeadProjectWizardDraft>;
    return {
      step: typeof parsed.step === 'number' ? parsed.step : 0,
      name: typeof parsed.name === 'string' ? parsed.name : '',
      brandColor: typeof parsed.brandColor === 'string' ? parsed.brandColor : '',
      showCustomColor: Boolean(parsed.showCustomColor),
      answersByQuestionId:
        parsed.answersByQuestionId && typeof parsed.answersByQuestionId === 'object'
          ? parsed.answersByQuestionId
          : {},
    };
  } catch {
    return emptyDraft;
  }
}

export function saveLeadProjectDraft(draft: LeadProjectWizardDraft) {
  if (!canUseStorage()) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Ignore storage failures.
  }
}

export function clearLeadProjectDraft() {
  if (!canUseStorage()) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}
