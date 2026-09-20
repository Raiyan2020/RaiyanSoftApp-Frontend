"use client";

import { useCallback, useEffect, useState } from 'react';
import {
  createProjectType,
  deleteProjectType,
  fetchProjectTypes,
  moveProjectType,
  updateProjectType,
} from '../services';

export interface ProjectType {
  id: string;
  slug?: string;
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

export function useAdminProjectTypes() {
  const [types, setTypes] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectTypeForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProjectTypes();
      setTypes([...data].sort((a, b) => a.order - b.order));
    } catch (err: any) {
      setError(err.message || 'Failed to load project types.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
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
    setError(null);
  };

  const saveType = async () => {
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await updateProjectType(editingId, form);
      } else {
        await createProjectType(form);
      }
      startCreate();
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to save project type.');
    } finally {
      setSaving(false);
    }
  };

  const moveType = async (id: string, direction: -1 | 1) => {
    setSaving(true);
    setError(null);
    try {
      await moveProjectType(id, direction);
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to reorder project type.');
    } finally {
      setSaving(false);
    }
  };

  const deleteType = async () => {
    if (!deleteId) return;
    setSaving(true);
    setError(null);
    try {
      await deleteProjectType(deleteId);
      if (editingId === deleteId) startCreate();
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to delete project type.');
    } finally {
      setSaving(false);
      setDeleteId(null);
    }
  };

  return {
    types,
    form,
    setForm,
    editingId,
    loading,
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
