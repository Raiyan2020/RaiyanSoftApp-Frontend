import { useState, useEffect } from 'react';
import { authService, type Admin } from '@/lib/auth-service';
import { updateAdminEmployee } from '@/features/admin-employees/api/admin-employees-api';
import { AdminProfileValues } from '../schemas/profile.schema';

const splitAdminName = (admin: Admin | null) => {
  const fullName = admin?.full_name || admin?.name || '';
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' '),
  };
};

export function useAdminAccount() {
  const [user, setUser] = useState<any>(null);
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
    const hydrateAdminData = () => {
      const profile = authService.getAdmin();
      const { firstName, lastName } = splitAdminName(profile);

      setUser(profile);
      setFormData({
        firstName,
        lastName,
        phone: profile?.phone || '',
        role: profile?.role || 'Admin',
        email: profile?.email || '',
      });
      setIsLoading(false);
    };

    hydrateAdminData();
  }, []);

  const handleSave = async (data: AdminProfileValues) => {
    setIsSaving(true);
    setSuccess(false);

    try {
      const currentAdmin = authService.getAdmin();
      const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ');
      let nextAdmin: Admin = {
        ...(currentAdmin || { id: user?.id }),
        id: Number(currentAdmin?.id || user?.id),
        name: fullName,
        full_name: fullName,
        phone: data.phone || '',
        email: data.email || formData.email || currentAdmin?.email,
        role: currentAdmin?.role || formData.role,
      };

      if (currentAdmin?.id) {
        const payload = {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone || '',
          role: currentAdmin.role || formData.role || undefined,
          ...(data.email || formData.email ? { email: data.email || formData.email } : {}),
        };
        const updated = await updateAdminEmployee(currentAdmin.id, payload);
        if (updated) {
          nextAdmin = {
            ...nextAdmin,
            name: [updated.first_name, updated.last_name].filter(Boolean).join(' ') || nextAdmin.name,
            full_name: [updated.first_name, updated.last_name].filter(Boolean).join(' ') || nextAdmin.full_name,
            email: updated.email || nextAdmin.email,
            phone: updated.phone || nextAdmin.phone,
            role: updated.role || nextAdmin.role,
          };
        }
      }

      authService.setAdminProfile(nextAdmin);
      setUser(nextAdmin);

      setFormData((prev) => ({
        ...prev,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || '',
        email: data.email || prev.email,
      }));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    user,
    isLoading,
    isSaving,
    success,
    formData,
    setFormData,
    handleSave,
  };
}
