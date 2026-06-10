import { useState, useEffect } from 'react';
import { authService, type Admin } from '@/lib/auth-service';
import { globalToast } from '@/lib/toast-context';
import { fetchAdminProfile, updateAdminProfile } from '../services/admin-profile-api';
import type { AdminProfileValues } from '../schemas/profile.schema';
import { translateMessage } from '@/lib/i18n-utils';

export function useAdminAccount() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    role: '',
    email: '',
  });

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setIsLoading(true);
      try {
        const profile = await fetchAdminProfile();
        if (cancelled) return;

        if (profile) {
          setFormData({
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            phone: profile.phone || '',
            role: profile.role || translateMessage('Admin'),
            email: profile.email || '',
          });

          const updatedAdmin: Admin = {
            ...(authService.getAdmin() || {}),
            id: profile.id,
            name: [profile.first_name, profile.last_name].filter(Boolean).join(' '),
            full_name: [profile.first_name, profile.last_name].filter(Boolean).join(' '),
            email: profile.email,
            phone: profile.phone || '',
            role: profile.role,
            admin_code: profile.admin_code,
          };
          authService.setAdminProfile(updatedAdmin);
        } else {
          const cached = authService.getAdmin();
          const fullName = cached?.full_name || cached?.name || '';
          const parts = fullName.trim().split(/\s+/).filter(Boolean);
          setFormData({
            firstName: parts[0] || '',
            lastName: parts.slice(1).join(' '),
            phone: cached?.phone || '',
            role: cached?.role || translateMessage('Admin'),
            email: cached?.email || '',
          });
        }
      } catch {
        const cached = authService.getAdmin();
        const fullName = cached?.full_name || cached?.name || '';
        const parts = fullName.trim().split(/\s+/).filter(Boolean);
        if (!cancelled) {
          setFormData({
            firstName: parts[0] || '',
            lastName: parts.slice(1).join(' '),
            phone: cached?.phone || '',
            role: cached?.role || translateMessage('Admin'),
            email: cached?.email || '',
          });
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadProfile();
    return () => { cancelled = true; };
  }, []);

  const handleSave = async (data: AdminProfileValues) => {
    setIsSaving(true);
    setSuccess(false);

    try {
      const payload: Parameters<typeof updateAdminProfile>[0] = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email || formData.email,
        phone: data.phone || '',
        ...(data.password ? { password: data.password } : {}),
      };

      const updated = await updateAdminProfile(payload);

      const updatedAdmin: Admin = {
        ...(authService.getAdmin() || {}),
        id: updated.id,
        name: [updated.first_name, updated.last_name].filter(Boolean).join(' '),
        full_name: [updated.first_name, updated.last_name].filter(Boolean).join(' '),
        email: updated.email,
        phone: updated.phone || '',
        role: updated.role,
        admin_code: updated.admin_code,
      };

      authService.setAdminProfile(updatedAdmin);

      setFormData({
        firstName: updated.first_name,
        lastName: updated.last_name,
        phone: updated.phone || '',
        role: updated.role,
        email: updated.email,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = translateMessage(err instanceof Error ? err.message : 'Failed to update profile.');
      globalToast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    user: authService.getAdmin(),
    isLoading,
    isSaving,
    success,
    formData,
    setFormData,
    handleSave,
  };
}
