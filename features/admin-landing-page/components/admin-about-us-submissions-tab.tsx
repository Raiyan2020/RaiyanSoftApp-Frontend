'use client';

import { useEffect, useState } from 'react';
import { Loader2, Mail, MessageSquareText, Phone, Trash2, UserRound } from 'lucide-react';
import Button from '@/components/ui/button';
import ConfirmModal from '@/components/ui/confirm-modal';
import ErrorAlert from '@/components/ui/error-alert';
import { translateMessage } from '@/lib/i18n-utils';
import {
  useAdminAboutUsSubmission,
  useAdminAboutUsSubmissions,
  useDeleteAdminAboutUsSubmission,
} from '../hooks/use-admin-landing-page';
import type { AdminAboutUsSubmission } from '@/features/landing-page';

function formatDate(value: string) {
  return value || translateMessage('Not set');
}

function SubmissionCard({
  submission,
  active,
  onSelect,
}: {
  submission: AdminAboutUsSubmission;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl border p-4 text-start transition ${
        active
          ? 'border-primary/40 bg-primary/5 shadow-sm'
          : 'border-[var(--border)] bg-[var(--surface)] hover:border-primary/25 hover:bg-[var(--surface-2)]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-black text-[var(--text)]">{submission.full_name}</p>
          <p className="mt-1 truncate text-sm text-[var(--text-muted)]">{submission.email}</p>
        </div>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
          {formatDate(submission.created_at)}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1">
          <Phone size={12} />
          {submission.phone}
        </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1">
          <MessageSquareText size={12} />
          {translateMessage('admin.project_request')}
        </span>
      </div>
    </button>
  );
}

export default function AdminAboutUsSubmissionsTab() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminAboutUsSubmission | null>(null);

  const listQuery = useAdminAboutUsSubmissions(page, 15);
  const detailQuery = useAdminAboutUsSubmission(selectedId);
  const deleteMutation = useDeleteAdminAboutUsSubmission();

  const submissions = listQuery.data?.submissions ?? [];
  const pagination = listQuery.data?.pagination ?? null;
  const selectedSubmission = detailQuery.data ?? null;

  useEffect(() => {
    if (!selectedId && submissions[0]) {
      setSelectedId(submissions[0].id);
    }
  }, [selectedId, submissions]);

  useEffect(() => {
    if (selectedId && !submissions.some((item) => item.id === selectedId) && submissions[0]) {
      setSelectedId(submissions[0].id);
    }
  }, [selectedId, submissions]);

  const selectSubmission = (submission: AdminAboutUsSubmission) => {
    setSelectedId(submission.id);
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    await deleteMutation.mutateAsync(pendingDelete.id);
    setPendingDelete(null);
    if (selectedId === pendingDelete.id) {
      setSelectedId(null);
    }
    await listQuery.refetch();
  };

  const total = pagination?.total ?? submissions.length;

  if (listQuery.isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center text-[var(--text-muted)]">
        <Loader2 className="me-2 animate-spin" size={18} />
        {translateMessage('admin.submissions_loading')}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[var(--text)]">{translateMessage('admin.about_us_submissions')}</h2>
          <p className="text-sm text-[var(--text-muted)]">
            {translateMessage('admin.about_us_submissions_subtitle')}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-[var(--text-muted)]">
          {total} {translateMessage('total')}
        </div>
      </div>

      {listQuery.error ? <ErrorAlert message={listQuery.error instanceof Error ? listQuery.error.message : translateMessage('admin.submissions_unable')} /> : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black text-[var(--text)]">{translateMessage('admin.submissions')}</h3>
            <span className="text-sm text-[var(--text-muted)]">
              {pagination ? `${pagination.current_page}/${pagination.last_page}` : ''}
            </span>
          </div>

          {submissions.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--text-muted)]">
              {translateMessage('admin.submissions_empty')}
            </p>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  active={submission.id === selectedId}
                  onSelect={() => selectSubmission(submission)}
                />
              ))}
            </div>
          )}

          {pagination && pagination.last_page > 1 ? (
            <div className="mt-5 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1}
              >
                {translateMessage('Previous')}
              </Button>
              <p className="text-sm text-[var(--text-muted)]">
                {translateMessage('Page')} {pagination.current_page} {translateMessage('of')} {pagination.last_page}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPage((current) => Math.min(pagination.last_page, current + 1))}
                disabled={page >= pagination.last_page}
              >
                {translateMessage('Next')}
              </Button>
            </div>
          ) : null}
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
          {!selectedSubmission && detailQuery.isLoading ? (
            <div className="flex min-h-80 items-center justify-center text-[var(--text-muted)]">
              <Loader2 className="me-2 animate-spin" size={18} />
              {translateMessage('admin.submissions_loading')}
            </div>
          ) : selectedSubmission ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-[var(--text)]">{selectedSubmission.full_name}</h3>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{translateMessage('admin.submissions_submitted_on')} {selectedSubmission.created_at}</p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setPendingDelete(selectedSubmission)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 size={14} className="me-2" />
                  {translateMessage('Delete')}
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)]">
                    <Mail size={14} />
                    {translateMessage('Email')}
                  </div>
                  <p className="break-all text-base font-bold text-[var(--text)]">{selectedSubmission.email}</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)]">
                    <Phone size={14} />
                    {translateMessage('Phone')}
                  </div>
                  <p className="text-base font-bold text-[var(--text)]">{selectedSubmission.phone}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)]">
                  <UserRound size={14} />
                  {translateMessage('Project Details')}
                </div>
                <p className="whitespace-pre-wrap leading-7 text-[var(--text)]">{selectedSubmission.project_details}</p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--text-muted)]">
              {translateMessage('admin.submissions_select_empty')}
            </div>
          )}
        </section>
      </div>

      <ConfirmModal
        isOpen={Boolean(pendingDelete)}
        title={translateMessage('admin.submissions_delete_title')}
        message={translateMessage('admin.submissions_delete_message')}
        confirmText={translateMessage('Delete')}
        isDestructive
        isConfirming={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
