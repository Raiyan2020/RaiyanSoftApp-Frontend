'use client';

import { useState } from 'react';
import { PublicField, PublicFormStatus, publicInputClass } from './public-form-fields';
import { trackPublicEvent } from '@/lib/analytics';
import { leadStore } from '@/lib/leadStore';
import PhoneInput from '@/components/ui/phone-input';

type PublicInquiryFormProps = {
  mode: 'contact' | 'quote';
};

export default function PublicInquiryForm({ mode }: PublicInquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [phone, setPhone] = useState('');

  const validate = (formData: FormData) => {
    const nextErrors: Record<string, string> = {};
    if (!String(formData.get('name') || '').trim()) nextErrors.name = 'اكتب الاسم الكامل.';
    if (!String(formData.get('email') || '').includes('@')) nextErrors.email = 'اكتب بريد إلكتروني صحيح.';
    if (!phone.trim()) nextErrors.phone = 'اكتب رقم الجوال.';
    if (!String(formData.get('message') || '').trim()) nextErrors.message = 'اكتب تفاصيل الطلب.';
    return nextErrors;
  };

  const onStart = () => {
    if (started) return;
    setStarted(true);
    trackPublicEvent('form_start', { form: mode });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextErrors = validate(formData);
    setErrors(nextErrors);
    setSubmitError('');
    if (Object.keys(nextErrors).length > 0) {
      trackPublicEvent('form_validation_error', { form: mode, errors: Object.keys(nextErrors).length });
      return;
    }

    setSubmitting(true);
    try {
      await leadStore.submitLead({
        name: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        phone: phone.trim(),
        source: mode === 'quote' ? 'public_quote_form' : 'public_contact_form',
        projectPayload: {
          type: mode,
          message: String(formData.get('message') || '').trim(),
          routingCategory: 'general',
          submittedFrom: typeof window !== 'undefined' ? window.location.pathname : '',
        },
      });
      trackPublicEvent('form_submit', { form: mode, service: 'general' });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'تعذر إرسال النموذج حاليا.');
      trackPublicEvent('form_submit_error', { form: mode });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <PublicFormStatus
        type="success"
        message="تم تجهيز نموذج الإرسال بنجاح. سيتم ربط هذا النموذج بالتخزين الفعلي في Phase D."
      />
    );
  }

  return (
    <form onSubmit={onSubmit} onFocus={onStart} className="space-y-5 rounded-lg border border-cyan-950/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      {submitError ? <PublicFormStatus type="error" message={submitError} /> : null}
      {submitting ? <PublicFormStatus type="loading" message="جار إرسال الطلب..." /> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <PublicField id="name" label="الاسم الكامل" required error={errors.name}>
          <input id="name" name="name" className={publicInputClass} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
        </PublicField>
        <PublicField id="email" label="البريد الإلكتروني" required error={errors.email}>
          <input id="email" name="email" type="email" dir="ltr" className={publicInputClass} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
        </PublicField>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <PublicField id="phone" label="رقم الجوال" required error={errors.phone}>
          <PhoneInput value={phone} onChange={(value) => setPhone(value || '')} required />
        </PublicField>
        <PublicField id="topic" label="الموضوع">
          <input id="topic" name="topic" className={publicInputClass} />
        </PublicField>
      </div>
      <PublicField id="message" label={mode === 'quote' ? 'تفاصيل المشروع' : 'الرسالة'} required error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={6}
          className={`${publicInputClass} resize-none`}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
      </PublicField>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-black text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'جار الإرسال...' : mode === 'quote' ? 'إرسال طلب عرض السعر' : 'إرسال الرسالة'}
      </button>
    </form>
  );
}
