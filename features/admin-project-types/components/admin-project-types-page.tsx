"use client";

import React from 'react';
import { ArrowDown, ArrowUp, Briefcase, Check, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import Button from '@/components/ui/button';
import ConfirmModal from '@/components/ui/confirm-modal';
import ErrorAlert from '@/components/ui/error-alert';
import { translateMessage } from '@/lib/i18n-utils';
import { ProjectType, useAdminProjectTypes } from '../hooks/use-admin-project-types';

const inputClasses =
  'w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-primary focus:outline-none transition-colors';

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs text-[var(--text-muted)] font-medium ms-1">
    {typeof children === 'string' ? translateMessage(children) : children}
  </label>
);

function TypeCard({
  type,
  index,
  total,
  isEditing,
  onEdit,
  onMove,
  onDelete,
}: {
  type: ProjectType;
  index: number;
  total: number;
  isEditing: boolean;
  onEdit: (type: ProjectType) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 transition-colors ${
        isEditing ? 'bg-primary/10 border-primary/30' : 'bg-[var(--surface-2)] border-[var(--border)]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <button type="button" onClick={() => onEdit(type)} className="text-left min-w-0 flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text)] shrink-0"
            style={{ background: type.color || '#1DB7F0' }}
          >
            <Briefcase size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[var(--text)] font-bold break-words">{type.name}</h3>
              <span className={type.active ? 'text-[10px] text-emerald-400' : 'text-[10px] text-[var(--text-muted)]'}>
                {type.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)] line-clamp-2 mt-1">{type.description || 'No description added.'}</p>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              {type.priceMin || type.priceMax ? `${type.priceMin || 0}-${type.priceMax || 0} KWD` : 'No price range'} ·{' '}
              {type.durationMin || type.durationMax
                ? `${type.durationMin || 0}-${type.durationMax || 0} days`
                : 'No duration range'}
            </p>
          </div>
        </button>
        <div className="flex items-center gap-1 shrink-0 sm:self-start self-end">
          <button
            type="button"
            onClick={() => onMove(type.id, -1)}
            disabled={index === 0}
            className="p-2 bg-[var(--surface-3)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 disabled:opacity-40"
            title="Move up"
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            onClick={() => onMove(type.id, 1)}
            disabled={index === total - 1}
            className="p-2 bg-[var(--surface-3)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 disabled:opacity-40"
            title="Move down"
          >
            <ArrowDown size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(type.id)}
            className="p-2 bg-[var(--surface-3)] rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10"
            title="Delete type"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProjectTypesPage() {
  const state = useAdminProjectTypes();

  if (state.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-[var(--text-muted)]">
        <Loader2 size={32} className="animate-spin mb-4 text-primary" />
        <p>{translateMessage('Loading project types...')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">{translateMessage('Project Types')}</h1>
          <p className="text-[var(--text-muted)] text-sm">{translateMessage('Manage service categories available to project requests.')}</p>
        </div>
        <Button type="button" onClick={state.startCreate} className="gap-2">
          <Plus size={18} />
          Add Type
        </Button>
      </div>

      {state.error ? <ErrorAlert message={state.error} /> : null}

      <div className="space-y-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Briefcase size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">{translateMessage(state.editingId ? 'Edit Type' : 'Add Type')}</h2>
              <p className="text-xs text-[var(--text-muted)]">{translateMessage('Optional estimates help admins price requests faster.')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <FieldLabel>Name</FieldLabel>
                <input
                  value={state.form.name}
                  onChange={(e) => state.setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className={inputClasses}
                  placeholder={translateMessage('E-commerce app')}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>Arabic Name</FieldLabel>
                <input
                  value={state.form.nameAr}
                  onChange={(e) => state.setForm((prev) => ({ ...prev, nameAr: e.target.value }))}
                  className={inputClasses}
                  placeholder={translateMessage('Arabic name')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <FieldLabel>Description</FieldLabel>
              <textarea
                value={state.form.description}
                onChange={(e) => state.setForm((prev) => ({ ...prev, description: e.target.value }))}
                className={`${inputClasses} h-24 resize-none`}
                placeholder={translateMessage('What this project type includes.')}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <FieldLabel>Min Price</FieldLabel>
                <input
                  type="number"
                  value={state.form.priceMin}
                  onChange={(e) => state.setForm((prev) => ({ ...prev, priceMin: e.target.value }))}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>Max Price</FieldLabel>
                <input
                  type="number"
                  value={state.form.priceMax}
                  onChange={(e) => state.setForm((prev) => ({ ...prev, priceMax: e.target.value }))}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>Min Days</FieldLabel>
                <input
                  type="number"
                  value={state.form.durationMin}
                  onChange={(e) => state.setForm((prev) => ({ ...prev, durationMin: e.target.value }))}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>Max Days</FieldLabel>
                <input
                  type="number"
                  value={state.form.durationMax}
                  onChange={(e) => state.setForm((prev) => ({ ...prev, durationMax: e.target.value }))}
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
              <div className="space-y-2">
                <FieldLabel>Color</FieldLabel>
                <input
                  type="color"
                  value={state.form.color}
                  onChange={(e) => state.setForm((prev) => ({ ...prev, color: e.target.value }))}
                  className="w-full h-12 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-1"
                />
              </div>
              <button
                type="button"
                onClick={() => state.setForm((prev) => ({ ...prev, active: !prev.active }))}
                className={`h-12 rounded-xl border px-4 text-sm font-bold flex items-center gap-2 ${
                  state.form.active
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)]'
                }`}
              >
                {state.form.active ? <Check size={15} /> : <X size={15} />}
                {translateMessage('Active')}
              </button>
            </div>

            <Button
              type="button"
              onClick={state.saveType}
              isLoading={state.saving}
              disabled={!state.form.name.trim()}
              className="w-full gap-2"
            >
              <Save size={16} />
              {translateMessage('Save Type')}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {state.types.length === 0 ? (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-16 text-center text-[var(--text-muted)]">
              <Briefcase size={32} className="mx-auto mb-3 text-[var(--text-muted)]" />
              <p>{translateMessage('No project types yet.')}</p>
            </div>
          ) : (
            state.types.map((type, index) => (
              <TypeCard
                key={type.id}
                type={type}
                index={index}
                total={state.types.length}
                isEditing={state.editingId === type.id}
                onEdit={state.startEdit}
                onMove={state.moveType}
                onDelete={state.setDeleteId}
              />
            ))
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!state.deleteId}
        title="Delete Project Type?"
        message="This removes the type from dashboard configuration."
        confirmText="Delete Type"
        isDestructive
        onConfirm={state.deleteType}
        onCancel={() => state.setDeleteId(null)}
      />
    </div>
  );
}
