"use client";

import { apiService, type ApiResponse } from './api-service';
import { translateMessage } from './i18n-utils';
import { fetchFormQuestions } from '@/features/lead-project/services/lead-project-api';
import { resolveQuestionType } from '@/features/lead-project/utils/question-helpers';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source?: string;
  projectPayload: any;
  status: 'new' | 'reviewing' | 'approved' | 'rejected' | 'claimed' | 'deleted';
  createdAt: number;
  rejectReason?: string;
  assignedTo?: string;
  reviewNotes?: string;
  approvedAt?: number;
  approvedBy?: string;
  rejectedAt?: number;
  rejectedBy?: string;
  claimTokenExpiresAt?: number;
  timeline?: {
    action: string;
    reason?: string;
    createdAt: number;
    createdByName?: string;
  }[];
  deletedAt?: number;
  deletedBy?: string;
  deleteReason?: string;
}

export interface ClaimToken {
  id: string;
  token: string;
  leadId: string;
  expiresAt: number;
  used: boolean;
}

type SubmitLeadPayload = {
  name: string;
  phone: string;
  email?: string;
  projectPayload: any;
  source?: string;
};

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

// The API validates submissions against `answers[]` (see backend
// StoreProjectRequest: `answers` is required and non-empty). The public
// marketing contact/quote form (components/public/public-inquiry-form.tsx)
// doesn't collect answers tied to real form_question ids, so we route its
// free-text summary through whichever question the dynamic lead-project
// wizard treats as free text (`resolveQuestionType`), keeping it compatible
// with the same backend contract. The lead-project wizard itself submits
// real structured `answers[]` directly via `storeProject` and does not use
// this helper.
async function findFreeTextQuestionId(): Promise<number | null> {
  const response = await fetchFormQuestions('en');
  if (!response.status || !Array.isArray(response.data)) return null;
  const textQuestion = response.data.find((question) => resolveQuestionType(question) === 'text');
  return textQuestion ? textQuestion.id : null;
}

async function buildLegacyLeadFormData(data: SubmitLeadPayload): Promise<FormData> {
  const projectPayload = data.projectPayload || {};
  const name = String(projectPayload.name || projectPayload.service || data.name || 'New project').trim();
  const description = String(projectPayload.description || projectPayload.message || '');

  const textQuestionId = await findFreeTextQuestionId();
  if (!textQuestionId) {
    throw new Error(translateMessage('Request failed.'));
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('project_name', name);
  formData.append('color', String(projectPayload.brandColor || projectPayload.color || '#1DB7F0'));
  formData.append('description', description);
  formData.append('phone', data.phone);
  if (data.email) formData.append('email', data.email);
  if (data.source) formData.append('source', data.source);
  formData.append('payload', JSON.stringify(projectPayload));
  formData.append('answers[0][form_question_id]', String(textQuestionId));
  formData.append('answers[0][text_value]', [name, description].filter(Boolean).join(' — ').slice(0, 1000));

  return formData;
}

class LeadStore {
  private leads: Lead[] = [];

  subscribeToLeads(listener: () => void) {
    listener();
    return () => {};
  }

  getLeads() {
    return [...this.leads];
  }

  async updateLeadStatus(_id: string, _status: Lead['status'], _reason?: string) {
    throw new Error('Use the Laravel admin leads API for lead status updates.');
  }

  async updateLeadReview(_id: string, _updates: Pick<Lead, 'assignedTo' | 'reviewNotes'>) {
    throw new Error('Lead review notes are not available in the Laravel backend routes yet.');
  }

  async generateClaimToken(_leadId: string): Promise<string> {
    throw new Error('Lead claim links are not available in the Laravel backend routes yet.');
  }

  async submitLead(data: SubmitLeadPayload): Promise<string> {
    const formData = await buildLegacyLeadFormData(data);
    const response = await apiService.post<{ id?: string | number; request_id?: string } | []>(
      'user/store-projects',
      formData,
      { skipGlobalToast: true }
    );

    if (!response.status) {
      throw new Error(getApiErrorMessage(response));
    }

    if (Array.isArray(response.data)) return '';
    return String(response.data?.request_id || response.data?.id || '');
  }

  async validateToken(_token: string): Promise<{ valid: boolean; leadId?: string; error?: string }> {
    return {
      valid: false,
      error: 'Lead claim links are not available in the Laravel backend routes yet.',
    };
  }

  async claimProject(_token: string, _leadId: string) {
    throw new Error('Lead claim links are not available in the Laravel backend routes yet.');
  }

  async deleteLead(_leadId: string): Promise<void> {
    throw new Error('Use the Laravel admin leads API for lead deletion.');
  }
}

export const leadStore = new LeadStore();
