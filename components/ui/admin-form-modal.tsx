'use client';

/**
 * AdminFormModal — shared overlay modal shell for admin create/edit forms.
 *
 * Handles: backdrop, scrollable container, title bar, close button,
 * backend error toast, and Save / Cancel footer.
 *
 * Usage:
 *   <AdminFormModal
 *     open={showForm}
 *     title={editingId ? translateMessage('Edit Service') : translateMessage('Add Service')}
 *     onClose={() => setShowForm(false)}
 *     onSubmit={handleSave}
 *     isSubmitting={isSaving}
 *     error={formError}
 *   >
 *     <BilingualFieldInputs ... />
 *     ...more fields...
 *   </AdminFormModal>
 */

import React from 'react';
import { Loader2, Save, X } from 'lucide-react';
import ErrorAlert from './error-alert';
import { translateMessage } from '@/lib/i18n-utils';

interface AdminFormModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void | Promise<void>;
  isSubmitting?: boolean;
  error?: string;
  /** Defaults to 'max-w-2xl' */
  maxWidth?: string;
  children: React.ReactNode;
}

export default function AdminFormModal({
  open,
  title,
  onClose,
  onSubmit,
  isSubmitting = false,
  error,
  maxWidth = 'max-w-2xl',
  children,
}: AdminFormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl`}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-[var(--text)]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-2)]"
            aria-label={translateMessage('Cancel')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form fields */}
        <div className="space-y-4">{children}</div>

        <ErrorAlert message={error} />

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)]"
          >
            {translateMessage('Cancel')}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50 hover:bg-primary/90"
          >
            {isSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {translateMessage('Save')}
          </button>
        </div>
      </div>
    </div>
  );
}
