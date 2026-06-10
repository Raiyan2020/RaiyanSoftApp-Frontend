import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAdminAccount } from '../hooks/use-admin-account';
import AdminProfileForm from './admin-profile-form';
import { translateMessage } from '@/lib/i18n-utils';

export default function AdminAccountPage() {
  const { isLoading, isSaving, success, formData, handleSave } = useAdminAccount();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--text-muted)] min-h-[50vh]">
        <Loader2 className="animate-spin mr-2" /> {translateMessage('Loading profile...')}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">{translateMessage('Account Settings')}</h1>
        <p className="text-[var(--text-muted)] text-sm">{translateMessage('Manage your admin profile and preferences.')}</p>
      </div>

      <AdminProfileForm
        defaultValues={formData}
        onSave={handleSave}
        isSaving={isSaving}
        success={success}
      />
    </div>
  );
}
