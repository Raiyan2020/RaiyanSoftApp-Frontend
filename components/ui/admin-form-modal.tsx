'use client';

/**
 * AdminFormModal — shared overlay modal shell for admin create/edit forms.
 *
 * Handles: backdrop, scrollable container, title bar, close button,
 * backend error toast, and Save / Cancel footer.
 *
 * Built on the shared Radix Dialog (z-[70]) so it dims the admin sidebar,
 * traps focus, closes on Esc, and lets confirm/reason dialogs (z-[80]) and
 * Select dropdowns (z-[90]) stack above it.
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
import { Loader2, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from './dialog';
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
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        aria-describedby={undefined}
        // Outside clicks never closed this form before; keep it that way so a
        // stray click (or a toast) can't discard unsaved input.
        onInteractOutside={(event) => event.preventDefault()}
        className={`block ${maxWidth}`}
      >
        {/* Header (close button comes from DialogContent) */}
        <DialogTitle className="mb-5 pe-8 text-lg">{title}</DialogTitle>

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
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary disabled:opacity-50 hover:bg-primary/90"
          >
            {isSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {translateMessage('Save')}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
