'use client';

import { useCallback, useState } from 'react';
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
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { colors, loading: listLoading, error: listError, reload } = useAdminColorsList();
  const { createColor, loading: createLoading, error: createError } = useCreateColor();

  const handleHexChange = useCallback((value: string) => {
    setHexCode(normalizeHex(value));
    setActionMessage(null);
    setValidationError(null);
  }, []);

  const handleCreate = useCallback(async () => {
    const normalized = normalizeHex(hexCode);
    setValidationError(null);
    setActionMessage(null);

    if (!/^#[0-9A-F]{6}$/i.test(normalized)) {
      setValidationError('Enter a valid hex color (e.g. #FF5733).');
      return;
    }

    const exists = colors.some((color) => color.hex_code.toUpperCase() === normalized);
    if (exists) {
      setValidationError('This color already exists.');
      return;
    }

    await createColor({ hex_code: normalized });
    setActionMessage('Color created successfully.');
    setHexCode(DEFAULT_HEX);
    await reload();
  }, [colors, createColor, hexCode, reload]);

  return {
    colors,
    hexCode,
    setHexCode: handleHexChange,
    listLoading,
    listError,
    createLoading,
    createError: createError || validationError,
    actionMessage,
    handleCreate,
    reload,
  };
}
