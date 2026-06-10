'use client';

/**
 * CrudItemList — generic list manager for admin CRUD sections.
 *
 * Handles:
 *  - Loading skeleton
 *  - Empty-state message
 *  - Item rows with Edit / Delete buttons
 *  - Internal confirm-delete modal
 *  - "Add" button header
 *
 * Pair it with <AdminFormModal> for the create / edit form.
 *
 * Usage:
 *   <CrudItemList
 *     title={translateMessage('Services')}
 *     items={services}
 *     isLoading={isLoading}
 *     emptyLabel={translateMessage('No services yet.')}
 *     addLabel={translateMessage('Add Service')}
 *     deleteConfirmLabel={translateMessage('Delete this service?')}
 *     onAdd={openCreate}
 *     onEdit={openEdit}
 *     onDelete={(id) => deleteMutation.mutateAsync(id)}
 *     isDeleting={deleteMutation.isPending}
 *     renderItem={(item) => <span>{item.title}</span>}
 *   />
 */

import React, { useState } from 'react';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { translateMessage } from '@/lib/i18n-utils';
import ConfirmModal from './confirm-modal';

interface CrudItemListProps<T extends { id: number }> {
  title: string;
  items: T[];
  isLoading?: boolean;
  emptyLabel?: string;
  addLabel?: string;
  deleteConfirmLabel?: string;
  renderItem: (item: T) => React.ReactNode;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (id: number) => void | Promise<void>;
  isDeleting?: boolean;
  /** Pass false to hide the Edit button per row */
  canEdit?: boolean;
  /** Pass false to hide the Delete button per row */
  canDelete?: boolean;
}

export default function CrudItemList<T extends { id: number }>({
  title,
  items,
  isLoading = false,
  emptyLabel,
  addLabel,
  deleteConfirmLabel,
  renderItem,
  onAdd,
  onEdit,
  onDelete,
  isDeleting = false,
  canEdit = true,
  canDelete = true,
}: CrudItemListProps<T>) {
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  async function confirmDelete() {
    if (pendingDeleteId == null) return;
    await onDelete?.(pendingDeleteId);
    setPendingDeleteId(null);
  }

  return (
    <>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
        {/* Header row */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-base font-bold text-[var(--text)]">
            {title}
            {!isLoading && (
              <span className="ms-1.5 font-normal text-[var(--text-muted)]">
                ({items.length})
              </span>
            )}
          </h3>
          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90"
            >
              <Plus size={14} />
              {addLabel ?? translateMessage('Add')}
            </button>
          )}
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center gap-2 py-4 text-sm text-[var(--text-muted)]">
            <Loader2 size={15} className="animate-spin" />
            {translateMessage('Loading...')}
          </div>
        ) : items.length === 0 ? (
          /* Empty */
          <p className="py-4 text-sm text-[var(--text-muted)]">
            {emptyLabel ?? translateMessage('No items yet.')}
          </p>
        ) : (
          /* Items */
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4"
              >
                {/* Custom render */}
                <div className="min-w-0 flex-1">{renderItem(item)}</div>

                {/* Actions */}
                <div className="flex shrink-0 gap-1">
                  {canEdit && onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--surface-3)] hover:text-[var(--text)]"
                      aria-label={translateMessage('Edit')}
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                  {canDelete && onDelete && (
                    <button
                      type="button"
                      onClick={() => setPendingDeleteId(item.id)}
                      disabled={isDeleting}
                      className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                      aria-label={translateMessage('Delete')}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm delete modal */}
      <ConfirmModal
        isOpen={pendingDeleteId != null}
        title={deleteConfirmLabel ?? translateMessage('Delete this item?')}
        message=""
        confirmText={translateMessage('Delete')}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
        isDestructive
      />
    </>
  );
}
