import { apiService } from '@/lib/api-service';
import { buildStoreProjectFormData } from '../utils/build-store-project-payload';
import { FormQuestion, LeadProjectDraft, StoredProject } from '../types/form-question.types';

function languageHeaders(language: string) {
  return { 'Accept-Language': language };
}

export async function fetchFormQuestions(language: string) {
  return apiService.get<FormQuestion[]>('user/form-questions', {
    headers: languageHeaders(language),
    skipGlobalToast: true,
  });
}

export async function storeProject(draft: LeadProjectDraft) {
  const formData = buildStoreProjectFormData(draft);
  return apiService.post<StoredProject | []>('user/store-projects', formData, {
    skipGlobalToast: true,
  });
}

export async function fetchMyProjects() {
  return apiService.get<StoredProject[]>('user/my-projects', {
    skipGlobalToast: true,
  });
}

export async function fetchMyProject(id: number | string) {
  return apiService.get<StoredProject>(`user/my-projects/${id}`, {
    skipGlobalToast: true,
  });
}
