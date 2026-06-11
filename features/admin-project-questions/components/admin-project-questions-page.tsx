"use client";

import React from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  GripVertical,
  ListChecks,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import Button from '@/components/ui/button';
import ConfirmModal from '@/components/ui/confirm-modal';
import ErrorAlert from '@/components/ui/error-alert';
import { translateMessage } from '@/lib/i18n-utils';
import {
  ProjectQuestion,
  ProjectQuestionOption,
  ProjectQuestionType,
  useAdminProjectQuestions,
} from '../hooks/use-admin-project-questions';

const inputClasses =
  'w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-primary focus:outline-none transition-colors';

const optionTypes: ProjectQuestionType[] = ['single_select', 'multi_select'];

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs text-[var(--text-muted)] font-medium ms-1">
    {typeof children === 'string' ? translateMessage(children) : children}
  </label>
);

const optionRowClasses =
  'rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-primary focus:outline-none transition-colors';

function OptionRow({
  option,
  index,
  onChange,
  onRemove,
  canRemove,
  onMove,
  canMoveUp,
  canMoveDown,
}: {
  option: ProjectQuestionOption;
  index: number;
  onChange: (index: number, patch: Partial<ProjectQuestionOption>) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
  onMove: (fromIndex: number, toIndex: number) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-primary/15 bg-primary/8 text-xs font-black text-primary">
            {index + 1}
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--text-muted)]">{translateMessage('Option')}</p>
            <p className="text-[11px] text-[var(--text-muted)]">{translateMessage('Order and labels are saved in this row.')}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onMove(index, index - 1)}
            disabled={!canMoveUp}
            className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs font-medium text-[var(--text-muted)] transition hover:border-primary/30 hover:text-[var(--text)] disabled:opacity-40"
            title={translateMessage('Move up')}
          >
            <ArrowUp size={12} />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, index + 1)}
            disabled={!canMoveDown}
            className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs font-medium text-[var(--text-muted)] transition hover:border-primary/30 hover:text-[var(--text)] disabled:opacity-40"
            title={translateMessage('Move down')}
          >
            <ArrowDown size={12} />
          </button>
          <button
            type="button"
            onClick={() => onRemove(index)}
            disabled={!canRemove}
            className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs font-medium text-[var(--text-muted)] transition hover:border-red-200 hover:text-red-400 disabled:opacity-40"
          >
            <Trash2 size={12} />
            {translateMessage('Remove')}
          </button>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3">
          <FieldLabel>English Label</FieldLabel>
          <input
            value={option.label}
            onChange={(event) => onChange(index, { label: event.target.value })}
            className={optionRowClasses}
            placeholder={translateMessage('Option label in English')}
          />
        </div>
        <div className="space-y-3">
          <FieldLabel>Arabic Label</FieldLabel>
          <input
            value={option.labelAr || ''}
            onChange={(event) => onChange(index, { labelAr: event.target.value })}
            className={optionRowClasses}
            placeholder={translateMessage('Option label in Arabic')}
          />
        </div>
      </div>
      <div className="mt-3 flex justify-start">
        <button
          type="button"
          onClick={() => onChange(index, { active: option.active === false ? true : false })}
          className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border px-4 text-xs font-bold transition ${
            option.active !== false
              ? 'border-primary/20 bg-primary/10 text-primary'
              : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)]'
          }`}
        >
          {option.active !== false ? <Check size={12} /> : <X size={12} />}
          {translateMessage(option.active !== false ? 'Active' : 'Inactive')}
        </button>
      </div>
    </div>
  );
}

function QuestionRow({
  question,
  index,
  total,
  isActive,
  isDragging,
  isDragOver,
  onEdit,
  onMove,
  onToggleActive,
  onDelete,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: {
  question: ProjectQuestion;
  index: number;
  total: number;
  isActive: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  onEdit: (question: ProjectQuestion) => void | Promise<void>;
  onMove: (id: string, direction: -1 | 1) => void;
  onToggleActive: (id: string) => void | Promise<void>;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDragLeave: (id: string) => void;
  onDrop: (id: string) => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        onDragOver(question.id);
      }}
      onDragLeave={() => onDragLeave(question.id)}
      onDrop={(event) => {
        event.preventDefault();
        onDrop(question.id);
      }}
      className={`rounded-2xl border p-4 transition-all ${
        isDragOver
          ? 'border-primary bg-primary/10 shadow-[0_0_0_2px_rgba(29,183,240,0.16)]'
          : isActive
          ? 'bg-primary/10 border-primary/30'
          : 'bg-[var(--surface-2)] border-[var(--border)]'
      } ${
        isDragging ? 'opacity-50 scale-[0.99]' : ''
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <button
          type="button"
          draggable
          onDragStart={(event) => {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', question.id);
            onDragStart(question.id);
          }}
          onDragEnd={onDragEnd}
          className="mt-1 cursor-grab rounded-lg p-1 text-[var(--text-muted)] hover:bg-[var(--surface-3)] hover:text-[var(--text)] active:cursor-grabbing"
          title={translateMessage('Drag to reorder')}
          aria-label={translateMessage('Drag to reorder')}
        >
          <GripVertical size={16} />
        </button>
        <button type="button" onClick={() => onEdit(question)} className="text-left min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-[var(--text)] break-words">{question.label}</h3>
            <span className="text-[10px] text-[var(--text)] bg-[var(--surface-3)] border border-[var(--border)] rounded-full px-2 py-0.5">
              {translateMessage(question.type.replace('_', ' '))}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px]">
            <span className={question.active ? 'text-emerald-400' : 'text-[var(--text-muted)]'}>
              {translateMessage(question.active ? 'Active' : 'Inactive')}
            </span>
            <span className={question.required ? 'text-primary' : 'text-[var(--text-muted)]'}>
              {translateMessage(question.required ? 'Required' : 'Optional')}
            </span>
            {question.locked ? <span className="text-amber-400">{translateMessage('Locked')}</span> : null}
          </div>
        </button>
        <div className="flex items-center gap-1 shrink-0 sm:self-start self-end">
          <button
            type="button"
            onClick={() => onMove(question.id, -1)}
            disabled={index === 0}
            className="p-2 bg-[var(--surface-3)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 disabled:opacity-40"
            title={translateMessage('Move up')}
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            onClick={() => onMove(question.id, 1)}
            disabled={index === total - 1}
            className="p-2 bg-[var(--surface-3)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 disabled:opacity-40"
            title={translateMessage('Move down')}
          >
            <ArrowDown size={14} />
          </button>
          <button
            type="button"
            onClick={() => onToggleActive(question.id)}
            className={`p-2 rounded-lg transition ${
              question.active
                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-[var(--surface-3)] text-[var(--text-muted)] hover:text-emerald-400'
            }`}
            title={translateMessage(question.active ? 'Deactivate question' : 'Activate question')}
          >
            {question.active ? <Check size={14} /> : <X size={14} />}
          </button>
          <button
            type="button"
            onClick={() => onDelete(question.id)}
            disabled={question.locked}
            className="p-2 bg-[var(--surface-3)] rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 disabled:opacity-40"
            title={translateMessage('Delete question')}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProjectQuestionsPage() {
  const state = useAdminProjectQuestions();
  const [draggedQuestionId, setDraggedQuestionId] = React.useState<string | null>(null);
  const [dragOverQuestionId, setDragOverQuestionId] = React.useState<string | null>(null);

  const clearDragState = () => {
    setDraggedQuestionId(null);
    setDragOverQuestionId(null);
  };

  if (state.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-[var(--text-muted)]">
        <Loader2 size={32} className="animate-spin mb-4 text-primary" />
        <p>{translateMessage('Loading project questions...')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">{translateMessage('Project Questions')}</h1>
          <p className="text-[var(--text-muted)] text-sm">{translateMessage('Manage the client project request wizard questions and options.')}</p>
        </div>
        <Button type="button" onClick={state.startCreate} className="gap-2">
          <Plus size={18} />
          {translateMessage('Add Question')}
        </Button>
      </div>

      {state.error ? <ErrorAlert message={state.error} /> : null}

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <ListChecks size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--text)]">
                  {translateMessage(state.selectedQuestion ? 'Edit Question' : 'Add Question')}
                </h2>
                <p className="text-xs text-[var(--text-muted)]">{translateMessage('Use one option per line. Add Arabic after a pipe character.')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <FieldLabel>English Label</FieldLabel>
                  <input
                    value={state.form.label}
                    onChange={(e) => state.setForm((prev) => ({ ...prev, label: e.target.value }))}
                    className={inputClasses}
                    placeholder={translateMessage('What platforms do you need?')}
                  />
                </div>
                <div className="space-y-3">
                  <FieldLabel>Arabic Label</FieldLabel>
                  <input
                    value={state.form.labelAr}
                    onChange={(e) => state.setForm((prev) => ({ ...prev, labelAr: e.target.value }))}
                    className={inputClasses}
                    placeholder={translateMessage('Arabic label')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <FieldLabel>Question Type</FieldLabel>
                  <select
                    value={state.form.type}
                    onChange={(e) => state.setForm((prev) => ({ ...prev, type: e.target.value as ProjectQuestionType }))}
                    className={inputClasses}
                  >
                    {state.questionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {translateMessage(type.label)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:pt-7">
                  {[
                    ['required', 'Required'],
                    ['active', 'Active'],
                    ['locked', 'Locked'],
                  ].map(([key, label]) => {
                    const checked = state.form[key as 'required' | 'active' | 'locked'];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          state.setForm((prev) => ({
                            ...prev,
                            [key]: !checked,
                          }))
                        }
                        className={`rounded-xl border px-3 py-2 text-xs font-bold flex items-center justify-center gap-1 ${
                          checked
                            ? 'bg-primary/10 text-primary border-primary/20'
                            : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)]'
                        }`}
                      >
                        {checked ? <Check size={13} /> : <X size={13} />}
                        {translateMessage(label)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {optionTypes.includes(state.form.type) ? (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1.5">
                      <FieldLabel>Options</FieldLabel>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {translateMessage('Add rows, then fill the English and Arabic labels for each choice.')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        state.setForm((prev) => ({
                          ...prev,
                          options: [
                            ...prev.options,
                            {
                              id: `option_${prev.options.length + 1}`,
                              label: '',
                              labelAr: '',
                              active: true,
                              order: prev.options.length + 1,
                            },
                          ],
                        }))
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-primary/20"
                    >
                      <Plus size={14} />
                      {translateMessage('Add Option')}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(state.form.options.length > 0 ? state.form.options : [{ id: 'option_1', label: '', labelAr: '', active: true, order: 1 }]).map(
                      (option, index) => (
                        <OptionRow
                          key={option.id}
                          option={option}
                          index={index}
                          canRemove={state.form.options.length > 1}
                          canMoveUp={index > 0}
                          canMoveDown={index < state.form.options.length - 1}
                          onMove={(fromIndex, toIndex) =>
                            state.setForm((prev) => {
                              if (toIndex < 0 || toIndex >= prev.options.length || fromIndex === toIndex) return prev;
                              const nextOptions = [...prev.options];
                              const [moved] = nextOptions.splice(fromIndex, 1);
                              nextOptions.splice(toIndex, 0, moved);
                              return {
                                ...prev,
                                options: nextOptions.map((item, itemIndex) => ({ ...item, order: itemIndex + 1 })),
                              };
                            })
                          }
                          onChange={(rowIndex, patch) =>
                            state.setForm((prev) => ({
                              ...prev,
                              options: prev.options.map((item, itemIndex) =>
                                itemIndex === rowIndex ? { ...item, ...patch } : item
                              ),
                            }))
                          }
                          onRemove={(rowIndex) =>
                            state.setForm((prev) => {
                              const nextOptions = prev.options.filter((_, itemIndex) => itemIndex !== rowIndex);
                              return {
                                ...prev,
                                options: nextOptions.length > 0 ? nextOptions : [{ id: 'option_1', label: '', labelAr: '', active: true, order: 1 }],
                              };
                            })
                          }
                        />
                      )
                    )}
                  </div>
                </div>
              ) : null}

              <Button
                type="button"
                onClick={state.saveQuestion}
                isLoading={state.saving}
                disabled={!state.form.label.trim()}
                className="gap-2"
              >
                <Save size={16} />
                {translateMessage('Save Question')}
              </Button>
            </div>
          </div>

        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[var(--text)]">{translateMessage('Question Order')}</h2>
            <span className="text-xs text-[var(--text-muted)] bg-[var(--surface-2)] border border-[var(--border)] rounded-full px-3 py-1">
              {state.questions.length} {translateMessage('total')}
            </span>
          </div>

          {state.questions.length === 0 ? (
            <div className="text-center py-16 text-[var(--text-muted)]">
              <ListChecks size={30} className="mx-auto mb-3 text-[var(--text-muted)]" />
              <p>{translateMessage('No project questions yet.')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {state.questions.map((question, index) => (
                <QuestionRow
                  key={question.id}
                  question={question}
                  index={index}
                  total={state.questions.length}
                  isActive={state.selectedQuestion?.id === question.id}
                  isDragging={draggedQuestionId === question.id}
                  isDragOver={dragOverQuestionId === question.id && draggedQuestionId !== question.id}
                  onEdit={(question) => state.startEdit(question).catch(() => undefined)}
                  onMove={state.moveQuestion}
                  onToggleActive={(id) => state.toggleQuestionActive(id).catch(() => undefined)}
                  onDelete={state.setDeleteId}
                  onDragStart={(id) => {
                    setDraggedQuestionId(id);
                    setDragOverQuestionId(null);
                  }}
                  onDragOver={(id) => {
                    if (draggedQuestionId && draggedQuestionId !== id) {
                      setDragOverQuestionId(id);
                    }
                  }}
                  onDragLeave={(id) => {
                    setDragOverQuestionId((current) => (current === id ? null : current));
                  }}
                  onDrop={(id) => {
                    if (draggedQuestionId && draggedQuestionId !== id) {
                      state.reorderQuestions(draggedQuestionId, id).catch(() => undefined);
                    }
                    clearDragState();
                  }}
                  onDragEnd={clearDragState}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!state.deleteId}
        title={translateMessage('Delete Question?')}
        message={translateMessage('This removes the question from the project request wizard configuration.')}
        confirmText={translateMessage('Delete Question')}
        isDestructive
        onConfirm={state.deleteQuestion}
        onCancel={() => state.setDeleteId(null)}
      />
    </div>
  );
}
