'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from './dialog';
import Button from './button';
import Textarea from './textarea';
import { translateMessage } from '@/lib/i18n-utils';

interface ReasonDialogProps {
  open: boolean;
  title: string;
  label?: string;
  submitLabel?: string;
  /** Matches the backend `max:1000` rule on reject reasons. */
  maxLength?: number;
  onClose: () => void;
  /** Throw to keep the dialog open (backend errors are toasted by the caller). */
  onSubmit: (reason: string) => void | Promise<void>;
}

/** Shared dialog that collects a required reason (e.g. rejecting a lead or booking) before the request is sent. */
export default function ReasonDialog(props: ReasonDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <Dialog
      open={props.open}
      onOpenChange={(open) => {
        if (!open && !submitting) props.onClose();
      }}
    >
      {/* z-[80] keeps it above the details dialogs (z-[70]) it is opened from. */}
      <DialogContent className="z-[80] max-w-md">
        <ReasonForm {...props} submitting={submitting} setSubmitting={setSubmitting} />
      </DialogContent>
    </Dialog>
  );
}

// Lives inside DialogContent so it unmounts on close, resetting the typed reason.
function ReasonForm({
  title,
  label = 'Rejection reason',
  submitLabel = 'Reject',
  maxLength = 1000,
  onClose,
  onSubmit,
  submitting,
  setSubmitting,
}: ReasonDialogProps & { submitting: boolean; setSubmitting: (value: boolean) => void }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    const trimmed = reason.trim();
    if (!trimmed) {
      setError('This field is required');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(trimmed);
    } catch {
      // Backend error is toasted by the caller; stay open so the user can retry.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <DialogTitle className="pe-8">{title}</DialogTitle>
      <DialogDescription className="sr-only">{translateMessage(label)}</DialogDescription>
      <Textarea
        label={label}
        value={reason}
        rows={4}
        maxLength={maxLength}
        autoFocus
        disabled={submitting}
        error={error}
        onChange={(event) => {
          setReason(event.target.value);
          if (error) setError(undefined);
        }}
      />
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
          {translateMessage('Cancel')}
        </Button>
        <Button type="submit" variant="destructive" isLoading={submitting}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
