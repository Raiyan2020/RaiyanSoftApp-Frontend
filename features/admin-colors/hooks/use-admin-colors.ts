'use client';

import { useCallback, useState } from 'react';
import { deleteAdminColor, fetchAdminColor, updateAdminColor } from '../api/admin-colors-api';
import { useAdminColorsList } from './use-admin-colors-list';
import { useCreateColor } from './use-create-color';

const DEFAULT_HEX = '#1DB7F0';

function normalizeHex(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('#') ? trimmed.toUpperCase() : `#${trimmed.toUpperCase()}`;
}

export function useAdminColors() {
  const [hexCode, setHexCode] = useState(DEFAULT_HEX);
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { colors, loading: listLoading, error: listError, reload } = useAdminColorsList();
  const { createColor, loading: createLoading, error: createError } = useCreateColor();

  const handleHexChange = useCallback((value: string) => {
    setHexCode(normalizeHex(value));
    setActionMessage(null);
    setValidationError(null);
  }, []);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setHexCode(DEFAULT_HEX);
    setIsActive(true);
    setValidationError(null);
    setActionMessage(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    const normalized = normalizeHex(hexCode);
    setValidationError(null);
    setActionMessage(null);

    if (!/^#[0-9A-F]{6}$/i.test(normalized)) {
      setValidationError('Enter a valid hex color (e.g. #FF5733).');
      return;
    }

    const exists = colors.some((color) => color.id !== editingId && color.hex_code.toUpperCase() === normalized);
    if (exists) {
      setValidationError('This color already exists.');
      return;
    }

    setActionLoading(true);
    try {
      if (editingId) {
        await updateAdminColor(editingId, { hex_code: normalized, is_active: isActive });
        setActionMessage('Color updated successfully.');
      } else {
        await createColor({ hex_code: normalized, is_active: isActive });
        setActionMessage('Color created successfully.');
      }
      setEditingId(null);
      setHexCode(DEFAULT_HEX);
      setIsActive(true);
      await reload();
    } finally {
      setActionLoading(false);
    }
  }, [colors, createColor, editingId, hexCode, isActive, reload]);

  const startEdit = useCallback(async (id: number) => {
    setActionLoading(true);
    setValidationError(null);
    setActionMessage(null);
    try {
      const color = await fetchAdminColor(id);
      setEditingId(color.id);
      setHexCode(normalizeHex(color.hex_code));
      setIsActive(color.is_active !== false && color.is_active !== 0);
    } catch (err: any) {
      setValidationError(err.message || 'Failed to load color.');
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    setActionLoading(true);
    setValidationError(null);
    setActionMessage(null);
    try {
      await deleteAdminColor(id);
      if (editingId === id) resetForm();
      setActionMessage('Color deleted successfully.');
      await reload();
    } finally {
      setActionLoading(false);
    }
  }, [editingId, reload, resetForm]);

  return {
    colors,
    hexCode,
    setHexCode: handleHexChange,
    isActive,
    setIsActive,
    editingId,
    listLoading,
    listError,
    createLoading: createLoading || actionLoading,
    createError: createError || validationError,
    actionMessage,
    handleCreate: handleSubmit,
    startEdit,
    handleDelete,
    resetForm,
    reload,
  };
}
