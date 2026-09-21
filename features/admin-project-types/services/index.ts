// admin-project-types — service/API layer
import { apiService, ApiResponse } from '@/lib/api-service';
import { ProjectType, ProjectTypeForm } from '../hooks/use-admin-project-types';

function getApiErrorMessage(response: ApiResponse<unknown>) {
  if (response.errors && typeof response.errors === 'object') {
    const errList = Object.values(response.errors).flat();
    if (errList.length > 0) return errList.join(' ');
  }
  return response.message || 'Request failed.';
}

function toPayload(form: ProjectTypeForm) {
  return {
    name: form.name,
    nameAr: form.nameAr || null,
    description: form.description || null,
    descriptionAr: form.descriptionAr || null,
    active: form.active,
    color: form.color || null,
    priceMin: form.priceMin === '' ? null : Number(form.priceMin),
    priceMax: form.priceMax === '' ? null : Number(form.priceMax),
    durationMin: form.durationMin === '' ? null : Number(form.durationMin),
    durationMax: form.durationMax === '' ? null : Number(form.durationMax),
  };
}

export async function fetchProjectTypes() {
  const response = await apiService.get<ProjectType[]>('admin/project-types', {
    skipGlobalToast: true,
  });

  if (!response.status || !Array.isArray(response.data)) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function createProjectType(form: ProjectTypeForm) {
  const response = await apiService.post<ProjectType>('admin/project-types', toPayload(form), {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function updateProjectType(id: string, form: ProjectTypeForm) {
  const response = await apiService.post<ProjectType>(`admin/project-types/${id}`, toPayload(form), {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }

  return response.data;
}

export async function moveProjectType(id: string, direction: -1 | 1) {
  const response = await apiService.post(`admin/project-types/${id}/move`, { direction }, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }
}

export async function deleteProjectType(id: string) {
  const response = await apiService.delete(`admin/project-types/${id}`, {
    skipGlobalToast: true,
  });

  if (!response.status) {
    throw new Error(getApiErrorMessage(response));
  }
}
