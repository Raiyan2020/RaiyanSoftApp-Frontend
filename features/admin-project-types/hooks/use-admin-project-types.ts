"use client";

import { useState } from 'react';

export interface ProjectType {
  id: string;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  active: boolean;
  order: number;
  color?: string;
  priceMin?: number | null;
  priceMax?: number | null;
  durationMin?: number | null;
  durationMax?: number | null;
}

export interface ProjectTypeForm {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  active: boolean;
  color: string;
  priceMin: string;
  priceMax: string;
  durationMin: string;
  durationMax: string;
}

const emptyForm: ProjectTypeForm = {
  name: '',
  nameAr: '',
  description: '',
  descriptionAr: '',
  active: true,
  color: '#1DB7F0',
  priceMin: '',
  priceMax: '',
  durationMin: '',
  durationMax: '',
};

const unavailableMessage = 'Project type management is not available in the Laravel backend routes yet.';

export function useAdminProjectTypes() {
  const [types] = useState<ProjectType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectTypeForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(unavailableMessage);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(unavailableMessage);
  };

  const startEdit = (type: ProjectType) => {
    setEditingId(type.id);
    setForm({
      name: type.name,
      nameAr: type.nameAr || '',
      description: type.description || '',
      descriptionAr: type.descriptionAr || '',
      active: type.active,
      color: type.color || '#1DB7F0',
      priceMin: type.priceMin ? String(type.priceMin) : '',
      priceMax: type.priceMax ? String(type.priceMax) : '',
      durationMin: type.durationMin ? String(type.durationMin) : '',
      durationMax: type.durationMax ? String(type.durationMax) : '',
    });
    setError(unavailableMessage);
  };

  const runUnavailableAction = async () => {
    setSaving(true);
    setError(unavailableMessage);
    setSaving(false);
  };

  const saveType = runUnavailableAction;
  const moveType = runUnavailableAction;

  const deleteType = async () => {
    await runUnavailableAction();
    setDeleteId(null);
  };

  return {
    types,
    form,
    setForm,
    editingId,
    loading: false,
    saving,
    error,
    setError,
    deleteId,
    setDeleteId,
    startCreate,
    startEdit,
    saveType,
    moveType,
    deleteType,
  };
}
