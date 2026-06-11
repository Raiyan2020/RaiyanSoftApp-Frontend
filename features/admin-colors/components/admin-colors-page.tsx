'use client';

import React from 'react';
import { Edit2, Loader2, Palette, Plus, Save, Trash2, X } from 'lucide-react';
import { useAdminColors } from '../hooks/use-admin-colors';
import ErrorAlert from '@/components/ui/error-alert';
import SuccessToast from '@/components/ui/success-toast';
import { translateMessage } from '@/lib/i18n-utils';

export default function AdminColorsPage() {
  const {
    colors,
    hexCode,
    setHexCode,
    isActive,
    setIsActive,
    editingId,
    listLoading,
    listError,
    createLoading,
    createError,
    actionMessage,
    handleCreate,
    startEdit,
    handleDelete,
    resetForm,
    reload,
  } = useAdminColors();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await handleCreate();
    } catch {
      // Errors are surfaced via createError or thrown validation.
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">{translateMessage('Colors')}</h1>
        <p className="text-sm text-[var(--text-muted)]">
          {translateMessage('Create preset colors used across the app, including project wizards and pickers.')}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">{translateMessage('Available Colors')}</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{colors.length} {translateMessage(colors.length === 1 ? 'color available to users' : 'colors available to users')}</p>
            </div>
            <button
              type="button"
              onClick={() => reload().catch(() => undefined)}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface-3)]"
            >
              {translateMessage('Refresh')}
            </button>
          </div>

          {listError ? <ErrorAlert message={listError} /> : null}

          {listLoading && colors.length === 0 ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin text-primary" size={28} />
            </div>
          ) : colors.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--border)] p-10 text-center text-sm text-[var(--text-muted)]">
              {translateMessage('No colors yet. Create the first preset color on the right.')}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {colors.map((color) => (
                <div
                  key={color.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-3"
                >
                  <div
                    className="mb-3 aspect-square rounded-xl border border-[var(--border)] shadow-inner"
                    style={{ backgroundColor: color.hex_code }}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs font-bold text-[var(--text)]">{color.hex_code}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                        ID {color.id} · {translateMessage(color.is_active === false || color.is_active === 0 ? 'Inactive' : 'Active')}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(color.id).catch(() => undefined)}
                        className="rounded-lg bg-[var(--surface-3)] p-1.5 text-[var(--text-muted)] transition hover:text-primary"
                        title={translateMessage('Edit color')}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(color.id).catch(() => undefined)}
                        disabled={createLoading}
                        className="rounded-lg bg-[var(--surface-3)] p-1.5 text-[var(--text-muted)] transition hover:text-red-400 disabled:opacity-50"
                        title={translateMessage('Delete color')}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="h-fit rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Palette size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">{translateMessage(editingId ? 'Edit Color' : 'Add Color')}</h2>
              <p className="text-sm text-[var(--text-muted)]">
                {editingId ? `${translateMessage('Updating color ID')} ${editingId}.` : translateMessage('Pick a hex value and save it.')}
              </p>
            </div>
          </div>

          {createError ? <ErrorAlert message={createError} /> : null}
          <SuccessToast message={actionMessage} />

          <form onSubmit={onSubmit} className="space-y-5">
            <div
              className="mx-auto h-28 w-28 rounded-full border-2 border-[var(--border)] shadow-lg transition-colors"
              style={{ backgroundColor: hexCode }}
            />

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-muted)]">{translateMessage('Color Picker')}</label>
              <input
                type="color"
                value={hexCode}
                onChange={(event) => setHexCode(event.target.value)}
                className="h-12 w-full cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-1"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-muted)]">{translateMessage('Hex Code')}</label>
              <input
                type="text"
                value={hexCode}
                onChange={(event) => setHexCode(event.target.value)}
                placeholder="#FF5733"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 font-mono uppercase text-[var(--text)] outline-none focus:border-primary"
              />
            </div>

            <label className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
              <span className="text-sm font-bold text-[var(--text-muted)]">{translateMessage('Active')}</span>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                className="h-5 w-5 accent-primary"
              />
            </label>

            <button
              type="submit"
              disabled={createLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:shadow-primary/20 disabled:opacity-50"
            >
              {createLoading ? <Loader2 className="animate-spin" size={18} /> : editingId ? <Save size={18} /> : <Plus size={18} />}
              {translateMessage(createLoading ? 'Saving...' : editingId ? 'Update Color' : 'Create Color')}
            </button>

            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm font-bold text-[var(--text)] transition hover:bg-[var(--surface-3)]"
              >
                <X size={18} />
                {translateMessage('Cancel Edit')}
              </button>
            ) : null}
          </form>
        </section>
      </div>
    </div>
  );
}
