'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Info, Shield } from 'lucide-react';
import { PageSlug } from '../types/page.types';
import { useAdminPages } from '../hooks/use-admin-pages';
import AdminPageEditor from './admin-page-editor';
import { translateMessage } from '@/lib/i18n-utils';

const tabs: { id: PageSlug; label: string; icon: typeof FileText }[] = [
  { id: 'privacy-policy', label: 'Privacy Policy', icon: Shield },
  { id: 'terms-conditions', label: 'Terms & Conditions', icon: FileText },
  { id: 'about-us', label: 'About Us', icon: Info },
];

export default function AdminPagesPage() {
  const router = useRouter();
  const { activeTab, changeTab, activeState } = useAdminPages();

  const handleTabChange = (tab: PageSlug) => {
    changeTab(tab);
    router.replace(`/admin/pages?tab=${tab}`);
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">{translateMessage('Pages')}</h1>
        <p className="text-sm text-[var(--text-muted)]">
          {translateMessage('Manage privacy policy, terms & conditions, and about us content shown in the app and website.')}
        </p>
      </div>

      <div className="flex w-fit flex-wrap gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-3)] p-1">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            <tab.icon size={16} />
            {translateMessage(tab.label)}
          </button>
        ))}
      </div>

      <div className="min-h-[500px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
        <AdminPageEditor
          slug={activeTab}
          form={activeState.form}
          setForm={activeState.setForm}
          loading={activeState.loading}
          error={activeState.error}
          saveLoading={activeState.saveLoading}
          saveError={activeState.saveError}
          saveMessage={activeState.saveMessage}
          onSave={async () => {
            try {
              await activeState.save();
              await activeState.reload();
            } catch {
              // Errors are surfaced in the editor state.
            }
          }}
          onReload={async () => {
            try {
              await activeState.reload();
            } catch {
              // Errors are surfaced in the editor state.
            }
          }}
        />
      </div>
    </div>
  );
}
