import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { globalToast } from '@/lib/toast-context';
import { translateMessage } from '@/lib/i18n-utils';
import { adminCountriesKeys } from '../query-keys';
import {
  CountryApiError,
  createAdminCountry,
  deleteAdminCountry,
  fetchAdminCountries,
  fetchAdminCountry,
  getAdminCountryImageUrl,
  updateAdminCountry,
} from '../services/admin-countries-api';
import type { AdminCountry, CountryFormValues, CountryPayload } from '../types/admin-country.types';

const emptyForm: CountryFormValues = {
  name: '',
  countryCode: '',
  phoneCode: '',
  isActive: true,
  image: null,
};

function mapCountryToForm(country: AdminCountry): CountryFormValues {
  return {
    name: country.name || '',
    countryCode: country.country_code || '',
    phoneCode: country.phone_code || '',
    isActive: country.is_active !== false,
    image: null,
  };
}

function mapErrorToFieldName(field: string): keyof CountryFormValues | null {
  if (field === 'country_code') return 'countryCode';
  if (field === 'phone_code') return 'phoneCode';
  if (field === 'is_active') return 'isActive';
  if (field === 'name') return 'name';
  if (field === 'image') return 'image';
  return null;
}

export function useAdminCountries() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [loadingCountryId, setLoadingCountryId] = useState<number | null>(null);
  const [form, setForm] = useState<CountryFormValues>(emptyForm);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CountryFormValues, string>>>({});
  const [formResetToken, setFormResetToken] = useState(0);

  const countriesQuery = useQuery({
    queryKey: adminCountriesKeys.all,
    queryFn: fetchAdminCountries,
    staleTime: 5 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    meta: { skipGlobalErrorToast: true },
  });

  const countries = countriesQuery.data ?? [];

  const saveMutation = useMutation({
    mutationFn: async (payload: { id?: number | null; values: CountryFormValues }) => {
      const body: CountryPayload = {
        name: payload.values.name.trim(),
        country_code: payload.values.countryCode.trim(),
        phone_code: payload.values.phoneCode.trim(),
        is_active: payload.values.isActive,
        ...(payload.values.image?.file ? { image: payload.values.image.file } : {}),
      };

      if (payload.id) {
        return updateAdminCountry(payload.id, body);
      }

      return createAdminCountry(body);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminCountriesKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => deleteAdminCountry(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminCountriesKeys.all });
    },
  });

  const resetForm = useCallback(() => {
    setEditingId(null);
    setCurrentImageUrl(null);
    setLoadingCountryId(null);
    setValidationError(null);
    setFieldErrors({});
    setForm(emptyForm);
    setFormResetToken((current) => current + 1);
  }, []);

  const startCreate = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const startEdit = useCallback(async (id: number) => {
    setLoadingCountryId(id);
    setValidationError(null);
    setFieldErrors({});

    try {
      const country = await fetchAdminCountry(id);
      setEditingId(country.id);
      setForm(mapCountryToForm(country));
      setCurrentImageUrl(getAdminCountryImageUrl(country.image));
      setFormResetToken((current) => current + 1);
    } catch (error: unknown) {
      const message = translateMessage(error instanceof Error ? error.message : 'Failed to load country.');
      setValidationError(message);
      globalToast.error(message);
    } finally {
      setLoadingCountryId(null);
    }
  }, []);

  const saveCountry = useCallback(async () => {
    setValidationError(null);
    setFieldErrors({});

    try {
      await saveMutation.mutateAsync({ id: editingId, values: form });
      globalToast.success(translateMessage(editingId ? 'Country updated successfully.' : 'Country created successfully.'));
      resetForm();
    } catch (error: unknown) {
      if (error instanceof CountryApiError && error.fieldErrors) {
        const nextFieldErrors: Partial<Record<keyof CountryFormValues, string>> = {};
        Object.entries(error.fieldErrors).forEach(([field, messages]) => {
          const nextField = mapErrorToFieldName(field);
          if (!nextField) return;
          nextFieldErrors[nextField] = messages.join(' ');
        });
        setFieldErrors(nextFieldErrors);
        const fieldMessage = Object.values(nextFieldErrors).filter(Boolean).join(' ');
        const message = translateMessage(fieldMessage || error.message || 'Failed to save country.');
        setValidationError(message);
        globalToast.error(message);
        return;
      }

      const message = translateMessage(error instanceof Error ? error.message : 'Failed to save country.');
      setValidationError(message);
      globalToast.error(message);
    }
  }, [editingId, form, resetForm, saveMutation]);

  const handleDelete = useCallback(async () => {
    if (pendingDeleteId == null) return;

    try {
      await deleteMutation.mutateAsync(pendingDeleteId);
      globalToast.success(translateMessage('Country deleted successfully.'));
      if (editingId === pendingDeleteId) {
        resetForm();
      }
      setPendingDeleteId(null);
    } catch (error: unknown) {
      const message = translateMessage(error instanceof Error ? error.message : 'Failed to delete country.');
      globalToast.error(message);
    }
  }, [deleteMutation, editingId, pendingDeleteId, resetForm]);

  const isBusy = saveMutation.isPending || deleteMutation.isPending || countriesQuery.isLoading || loadingCountryId !== null;

  const sortedCountries = useMemo(
    () => [...countries].sort((a, b) => Number(b.is_active) - Number(a.is_active) || a.name.localeCompare(b.name)),
    [countries]
  );

  return {
    countries: sortedCountries,
    form,
    setForm,
    editingId,
    loadingCountryId,
    currentImageUrl,
    listLoading: countriesQuery.isLoading,
    listError: countriesQuery.error instanceof Error ? countriesQuery.error.message : null,
    reload: countriesQuery.refetch,
    saveLoading: saveMutation.isPending,
    deleteLoading: deleteMutation.isPending,
    validationError,
    fieldErrors,
    isBusy,
    startCreate,
    startEdit,
    saveCountry,
    pendingDeleteId,
    setPendingDeleteId,
    handleDelete,
    resetForm,
    formResetToken,
  };
}
