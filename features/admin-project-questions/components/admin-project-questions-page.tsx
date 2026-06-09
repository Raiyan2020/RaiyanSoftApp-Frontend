"use client";

import React from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
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
import {
  ProjectQuestion,
  ProjectQuestionType,
  useAdminProjectQuestions,
} from '../hooks/use-admin-project-questions';

const inputClasses =
  'w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-primary focus:outline-none transition-colors';

const optionTypes: ProjectQuestionType[] = ['single_select', 'multi_select'];

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs text-[var(--text-muted)] font-medium ms-1">{children}</label>
);

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
          title="Drag to reorder"
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
        <button type="button" onClick={() => onEdit(question)} className="text-left min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-[var(--text)] break-words">{question.label}</h3>
            <span className="text-[10px] text-[var(--text)] bg-[var(--surface-3)] border border-[var(--border)] rounded-full px-2 py-0.5">
              {question.type.replace('_', ' ')}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px]">
            <span className={question.active ? 'text-emerald-400' : 'text-[var(--text-muted)]'}>
              {question.active ? 'Active' : 'Inactive'}
            </span>
            <span className={question.required ? 'text-primary' : 'text-[var(--text-muted)]'}>
              {question.required ? 'Required' : 'Optional'}
            </span>
            {question.locked ? <span className="text-amber-400">Locked</span> : null}
          </div>
        </button>
        <div className="flex items-center gap-1 shrink-0 sm:self-start self-end">
          <button
            type="button"
            onClick={() => onMove(question.id, -1)}
            disabled={index === 0}
            className="p-2 bg-[var(--surface-3)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 disabled:opacity-40"
            title="Move up"
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            onClick={() => onMove(question.id, 1)}
            disabled={index === total - 1}
            className="p-2 bg-[var(--surface-3)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 disabled:opacity-40"
            title="Move down"
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
            title={question.active ? 'Deactivate question' : 'Activate question'}
          >
            {question.active ? <Check size={14} /> : <X size={14} />}
          </button>
          <button
            type="button"
            onClick={() => onDelete(question.id)}
            disabled={question.locked}
            className="p-2 bg-[var(--surface-3)] rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 disabled:opacity-40"
            title="Delete question"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionPreview({
  label,
  type,
  optionsText,
  required,
}: {
  label: string;
  type: ProjectQuestionType;
  optionsText: string;
  required: boolean;
}) {
  const options = optionsText
    .split('\n')
    .map((line) => line.split('|')[0].trim())
    .filter(Boolean);

  return (
    <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Eye size={18} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[var(--text)]">Client Preview</h2>
          <p className="text-xs text-[var(--text-muted)]">A compact preview of the wizard question.</p>
        </div>
      </div>
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
        <p className="text-lg font-bold text-[var(--text)] leading-snug">
          {label || 'Question label'}
          {required ? <span className="text-primary"> *</span> : null}
        </p>
        <div className="mt-5">
          {type === 'textarea' ? <div className="h-28 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]" /> : null}
          {type === 'text' || type === 'reference_app' ? (
            <div className="h-12 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]" />
          ) : null}
          {type === 'yes_no' ? (
            <div className="grid grid-cols-2 gap-3">
              {['Yes', 'No'].map((item) => (
                <div key={item} className="rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--text)]">
                  {item}
                </div>
              ))}
            </div>
          ) : null}
          {type === 'color' ? (
            <div className="flex gap-3">
              {['#1DB7F0', '#22C55E', '#F59E0B', '#EF4444'].map((color) => (
                <div key={color} className="w-10 h-10 rounded-full border border-[var(--border)]" style={{ background: color }} />
              ))}
            </div>
          ) : null}
          {optionTypes.includes(type) ? (
            <div className="space-y-2">
              {(options.length ? options : ['Option one', 'Option two']).map((option) => (
                <div key={option} className="rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--text)]">
                  {option}
                </div>
              ))}
            </div>
          ) : null}
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
        <p>Loading project questions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Project Questions</h1>
          <p className="text-[var(--text-muted)] text-sm">Manage the client project request wizard questions and options.</p>
        </div>
        <Button type="button" onClick={state.startCreate} className="gap-2">
          <Plus size={18} />
          Add Question
        </Button>
      </div>

      {state.error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-red-400 shrink-0" size={20} />
          <p className="text-red-400/80 text-sm">{state.error}</p>
          <button type="button" onClick={() => state.setError(null)} className="ms-auto text-red-300">
            <X size={16} />
          </button>
        </div>
      ) : null}

      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <ListChecks size={18} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--text)]">
                  {state.selectedQuestion ? 'Edit Question' : 'Add Question'}
                </h2>
                <p className="text-xs text-[var(--text-muted)]">Use one option per line. Add Arabic after a pipe character.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <FieldLabel>English Label</FieldLabel>
                  <input
                    value={state.form.label}
                    onChange={(e) => state.setForm((prev) => ({ ...prev, label: e.target.value }))}
                    className={inputClasses}
                    placeholder="What platforms do you need?"
                  />
                </div>
                <div className="space-y-2">
                  <FieldLabel>Arabic Label</FieldLabel>
                  <input
                    value={state.form.labelAr}
                    onChange={(e) => state.setForm((prev) => ({ ...prev, labelAr: e.target.value }))}
                    className={inputClasses}
                    placeholder="Arabic label"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <FieldLabel>Question Type</FieldLabel>
                  <select
                    value={state.form.type}
                    onChange={(e) => state.setForm((prev) => ({ ...prev, type: e.target.value as ProjectQuestionType }))}
                    className={inputClasses}
                  >
                    {state.questionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:pt-6">
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
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {optionTypes.includes(state.form.type) ? (
                <div className="space-y-2">
                  <FieldLabel>Options</FieldLabel>
                  <textarea
                    value={state.form.optionsText}
                    onChange={(e) => state.setForm((prev) => ({ ...prev, optionsText: e.target.value }))}
                    className={`${inputClasses} h-36 resize-none`}
                    placeholder={'iOS | ايفون\nAndroid | اندرويد\nWeb | ويب'}
                  />
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
                Save Question
              </Button>
            </div>
          </div>

          <QuestionPreview
            label={state.form.label}
            type={state.form.type}
            optionsText={state.form.optionsText}
            required={state.form.required}
          />
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[var(--text)]">Question Order</h2>
            <span className="text-xs text-[var(--text-muted)] bg-[var(--surface-2)] border border-[var(--border)] rounded-full px-3 py-1">
              {state.questions.length} total
            </span>
          </div>

          {state.questions.length === 0 ? (
            <div className="text-center py-16 text-[var(--text-muted)]">
              <ListChecks size={30} className="mx-auto mb-3 text-[var(--text-muted)]" />
              <p>No project questions yet.</p>
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
        title="Delete Question?"
        message="This removes the question from the project request wizard configuration."
        confirmText="Delete Question"
        isDestructive
        onConfirm={state.deleteQuestion}
        onCancel={() => state.setDeleteId(null)}
      />
    </div>
  );
}
