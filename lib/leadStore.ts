"use client";

import { apiService, type ApiResponse } from './api-service';

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

function buildLegacyLeadFormData(data: SubmitLeadPayload) {
  const projectPayload = data.projectPayload || {};
  const formData = new FormData();

  formData.append('name', String(projectPayload.name || projectPayload.service || data.name || 'New project').trim());
  formData.append('project_name', String(projectPayload.name || projectPayload.service || data.name || 'New project').trim());
  formData.append('color', String(projectPayload.brandColor || projectPayload.color || '#1DB7F0'));
  formData.append('description', String(projectPayload.description || projectPayload.message || ''));
  formData.append('phone', data.phone);
  if (data.email) formData.append('email', data.email);
  if (data.source) formData.append('source', data.source);
  formData.append('payload', JSON.stringify(projectPayload));

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
    const response = await apiService.post<{ id?: string | number; request_id?: string } | []>(
      'user/store-projects',
      buildLegacyLeadFormData(data),
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
