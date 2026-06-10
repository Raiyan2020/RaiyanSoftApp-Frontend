"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AdminFormQuestion,
  AdminFormQuestionOption,
  createAdminFormQuestion,
  deleteAdminFormQuestion,
  fetchAdminFormQuestion,
  fetchAdminFormQuestionTypes,
  fetchAdminFormQuestions,
  updateAdminFormQuestion,
  updateAdminFormQuestionActiveStatus,
  updateAdminFormQuestionSortOrder,
  type AdminFormQuestionPayload,
} from '../services/admin-form-questions-api';

export type ProjectQuestionType =
  | 'text'
  | 'textarea'
  | 'single_select'
  | 'multi_select'
  | 'yes_no'
  | 'color'
  | 'reference_app';

export interface ProjectQuestionOption {
  id: string;
  label: string;
  labelAr?: string;
  active?: boolean;
  order?: number;
}

export interface ProjectQuestion {
  id: string;
  label: string;
  labelAr?: string;
  type: ProjectQuestionType;
  options: ProjectQuestionOption[];
  order: number;
  required: boolean;
  active: boolean;
  locked: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ProjectQuestionFormState {
  label: string;
  labelAr: string;
  type: ProjectQuestionType;
  optionsText: string;
  optionIds?: string[];
  required: boolean;
  active: boolean;
  locked: boolean;
}

export interface ProjectQuestionTypeOption {
  value: ProjectQuestionType;
  label: string;
}

const emptyForm: ProjectQuestionFormState = {
  label: '',
  labelAr: '',
  type: 'single_select',
  optionsText: '',
  required: true,
  active: true,
  locked: false,
};

const fallbackQuestionTypes: ProjectQuestionTypeOption[] = [
  { value: 'text', label: 'Text' },
  { value: 'single_select', label: 'Single select' },
];

const optionTypes: ProjectQuestionType[] = ['single_select', 'multi_select', 'yes_no', 'color'];

function readTranslatedValue(value: string | { en?: string; ar?: string } | undefined, locale: 'en' | 'ar') {
  if (!value) return '';
  if (typeof value === 'string') return locale === 'en' ? value : '';
  return value[locale] || '';
}

function mapApiType(type: AdminFormQuestion['type'], options: AdminFormQuestionOption[] = []): ProjectQuestionType {
  if (type === 2) return 'text';
  return options.length > 0 ? 'single_select' : 'single_select';
}

function mapApiQuestionTypeOption(type: { value?: number; id?: number; name?: string; label?: string; key?: string }): ProjectQuestionTypeOption | null {
  const value = type.value ?? type.id;
  if (value === 1) return { value: 'single_select', label: type.label || type.name || 'Single select' };
  if (value === 2) return { value: 'text', label: type.label || type.name || 'Text' };
  return null;
}

function normalizeQuestion(question: AdminFormQuestion, index: number): ProjectQuestion {
  const options = (question.options || [])
    .map((option, optionIndex) => ({
      id: String(option.id ?? `option_${optionIndex + 1}`),
      label: readTranslatedValue(option.value, 'en') || `Option ${optionIndex + 1}`,
      labelAr: readTranslatedValue(option.value, 'ar'),
      active: option.is_active !== false && option.is_active !== 0,
      order: typeof option.sort_order === 'number' ? option.sort_order : optionIndex,
    }))
    .sort((first, second) => (first.order ?? 0) - (second.order ?? 0));

  return {
    id: String(question.id),
    label: readTranslatedValue(question.name, 'en') || 'Untitled question',
    labelAr: readTranslatedValue(question.name, 'ar'),
    type: mapApiType(question.type, question.options),
    options,
    order: typeof question.sort_order === 'number' ? question.sort_order : index,
    required: true,
    active: question.is_active !== false && question.is_active !== 0,
    locked: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

const optionsToText = (options: ProjectQuestionOption[]) =>
  options.map((option) => (option.labelAr ? `${option.label} | ${option.labelAr}` : option.label)).join('\n');

const textToOptions = (value: string): ProjectQuestionOption[] =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [label, labelAr] = line.split('|').map((part) => part.trim());
      return {
        id: `option_${index + 1}`,
        label,
        labelAr: labelAr || '',
        active: true,
        order: index + 1,
      };
    });

function mapFormToPayload(form: ProjectQuestionFormState, sortOrder: number): AdminFormQuestionPayload {
  const options = optionTypes.includes(form.type)
    ? textToOptions(form.optionsText).map((option, index) => ({
        id: form.optionIds?.[index],
        value_en: option.label,
        value_ar: option.labelAr,
        is_active: option.active !== false,
        sort_order: index + 1,
      }))
    : [];

  return {
    name_en: form.label.trim(),
    name_ar: form.labelAr.trim() || form.label.trim(),
    type: optionTypes.includes(form.type) ? 1 : 2,
    is_active: form.active,
    sort_order: sortOrder,
    options,
  };
}

export function useAdminProjectQuestions() {
  const [questions, setQuestions] = useState<ProjectQuestion[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectQuestionFormState>(emptyForm);
  const [questionTypes, setQuestionTypes] = useState<ProjectQuestionTypeOption[]>(fallbackQuestionTypes);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [data, types] = await Promise.all([
        fetchAdminFormQuestions(),
        fetchAdminFormQuestionTypes().catch(() => []),
      ]);
      const nextTypes = types.map(mapApiQuestionTypeOption).filter((type): type is ProjectQuestionTypeOption => Boolean(type));
      if (nextTypes.length > 0) {
        setQuestionTypes(nextTypes);
      }
      const nextQuestions = data
        .map((item, index) => normalizeQuestion(item, index))
        .sort((first, second) => first.order - second.order);
      setQuestions(nextQuestions);
    } catch (err: any) {
      console.error('Project questions load error:', err);
      setError(err.message || 'Failed to load project questions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions().catch(() => undefined);
  }, [loadQuestions]);

  const selectedQuestion = useMemo(
    () => questions.find((question) => question.id === selectedId) || null,
    [questions, selectedId]
  );

  const startCreate = useCallback(() => {
    setSelectedId(null);
    setForm(emptyForm);
  }, []);

  const startEdit = useCallback(async (question: ProjectQuestion) => {
    setSaving(true);
    setError(null);
    try {
      const detail = await fetchAdminFormQuestion(question.id);
      const freshQuestion = normalizeQuestion(detail, question.order);
      setSelectedId(freshQuestion.id);
      setForm({
        label: freshQuestion.label,
        labelAr: freshQuestion.labelAr || '',
        type: freshQuestion.type,
        optionsText: optionsToText(freshQuestion.options),
        optionIds: freshQuestion.options.map((option) => option.id),
        required: freshQuestion.required,
        active: freshQuestion.active,
        locked: freshQuestion.locked,
      });
    } catch (err: any) {
      console.error('Failed to load project question:', err);
      setError(err.message || 'Failed to load project question.');
    } finally {
      setSaving(false);
    }
  }, []);

  const saveQuestion = useCallback(async () => {
    if (!form.label.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const existing = selectedId ? questions.find((question) => question.id === selectedId) : null;
      const sortOrder = existing?.order ?? questions.length + 1;
      const payload = mapFormToPayload(form, sortOrder);

      if (selectedId) {
        await updateAdminFormQuestion(selectedId, payload);
      } else {
        const created = await createAdminFormQuestion(payload);
        if (created?.id) setSelectedId(String(created.id));
      }

      await loadQuestions();
    } catch (err: any) {
      console.error('Failed to save project question:', err);
      setError(err.message || 'Failed to save project question.');
    } finally {
      setSaving(false);
    }
  }, [form, loadQuestions, questions, selectedId]);

  const moveQuestion = useCallback(async (questionId: string, direction: -1 | 1) => {
    const index = questions.findIndex((question) => question.id === questionId);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= questions.length) return;

    const nextQuestions = [...questions];
    [nextQuestions[index], nextQuestions[targetIndex]] = [nextQuestions[targetIndex], nextQuestions[index]];
    const reordered = nextQuestions.map((question, order) => ({ ...question, order: order + 1 }));

    setQuestions(reordered);
    setSaving(true);
    setError(null);

    try {
      await updateAdminFormQuestionSortOrder(
        reordered.map((question) => ({
          id: question.id,
          sort_order: question.order,
        }))
      );
      await loadQuestions();
    } catch (err: any) {
      console.error('Failed to reorder project questions:', err);
      setError(err.message || 'Failed to reorder project questions.');
      await loadQuestions();
    } finally {
      setSaving(false);
    }
  }, [loadQuestions, questions]);

  const reorderQuestions = useCallback(async (activeId: string, overId: string) => {
    if (activeId === overId) return;

    const activeIndex = questions.findIndex((question) => question.id === activeId);
    const overIndex = questions.findIndex((question) => question.id === overId);
    if (activeIndex < 0 || overIndex < 0) return;

    const nextQuestions = [...questions];
    const [movedQuestion] = nextQuestions.splice(activeIndex, 1);
    nextQuestions.splice(overIndex, 0, movedQuestion);
    const reordered = nextQuestions.map((question, order) => ({ ...question, order: order + 1 }));

    setQuestions(reordered);
    setSaving(true);
    setError(null);

    try {
      await updateAdminFormQuestionSortOrder(
        reordered.map((question) => ({
          id: question.id,
          sort_order: question.order,
        }))
      );
      await loadQuestions();
    } catch (err: any) {
      console.error('Failed to reorder project questions:', err);
      setError(err.message || 'Failed to reorder project questions.');
      await loadQuestions();
    } finally {
      setSaving(false);
    }
  }, [loadQuestions, questions]);

  const deleteQuestion = useCallback(async () => {
    if (!deleteId) return;
    const question = questions.find((item) => item.id === deleteId);
    if (question?.locked) {
      setError('Locked questions cannot be deleted.');
      setDeleteId(null);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await deleteAdminFormQuestion(deleteId);
      if (selectedId === deleteId) startCreate();
      setDeleteId(null);
      await loadQuestions();
    } catch (err: any) {
      console.error('Failed to delete project question:', err);
      setError(err.message || 'Failed to delete project question.');
    } finally {
      setSaving(false);
    }
  }, [deleteId, loadQuestions, questions, selectedId, startCreate]);

  const toggleQuestionActive = useCallback(async (questionId: string) => {
    const question = questions.find((item) => item.id === questionId);
    if (!question) return;
    const nextActive = !question.active;
    setQuestions((current) =>
      current.map((item) => (item.id === questionId ? { ...item, active: nextActive } : item))
    );
    setSaving(true);
    setError(null);

    try {
      await updateAdminFormQuestionActiveStatus([{ id: questionId, is_active: nextActive }]);
      if (selectedId === questionId) {
        setForm((current) => ({ ...current, active: nextActive }));
      }
      await loadQuestions();
    } catch (err: any) {
      console.error('Failed to update question status:', err);
      setError(err.message || 'Failed to update question status.');
      await loadQuestions();
    } finally {
      setSaving(false);
    }
  }, [loadQuestions, questions, selectedId]);

  return {
    questions,
    questionTypes,
    selectedQuestion,
    form,
    setForm,
    loading,
    saving,
    error,
    setError,
    deleteId,
    setDeleteId,
    startCreate,
    startEdit,
    saveQuestion,
    moveQuestion,
    reorderQuestions,
    deleteQuestion,
    toggleQuestionActive,
  };
}
