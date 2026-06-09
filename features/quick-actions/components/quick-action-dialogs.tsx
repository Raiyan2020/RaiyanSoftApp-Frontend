'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle2, FolderPlus, Loader2, Phone, User, X } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PhoneInput from '@/components/ui/phone-input';
import Textarea from '@/components/ui/textarea';
import LeadProjectWizard from '@/features/lead-project/components/lead-project-wizard';
import BookingWizard from '@/features/appointments/components/booking-wizard';
import { User as AuthUser } from '@/lib/auth-service';
import { useTranslation } from '@/lib/i18nContext';
import { getUserDisplayName } from '@/lib/user-display';

type QuickActionMode = 'booking' | 'lead';

interface QuickActionDialogProps {
  isOpen: boolean;
  mode: QuickActionMode;
  onClose: () => void;
  user?: AuthUser | null;
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  topic: string;
  date: string;
  time: string;
  budget: string;
  notes: string;
}

const emptyForm: FormState = {
  name: '',
  phone: '',
  email: '',
  topic: '',
  date: '',
  time: '',
  budget: '',
  notes: '',
};

export function QuickBookingDialog({ isOpen, onClose }: Omit<QuickActionDialogProps, 'mode'>) {
  if (!isOpen) return null;
  return <BookingWizard onClose={onClose} />;
}

export function QuickLeadDialog({ isOpen, onClose }: Omit<QuickActionDialogProps, 'mode'>) {
  const { dir, language } = useTranslation();
  const [requestId, setRequestId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setRequestId(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const closeDialog = () => {
    setRequestId(null);
    onClose();
  };

  if (requestId !== null) {
    return (
      <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" dir={dir}>
        <div className="w-full max-w-sm rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center shadow-2xl">
          <CheckCircle2 className="mx-auto mb-3 text-emerald-400" size={42} />
          <h3 className="text-xl font-black text-[var(--text)]">
            {language === 'ar' ? 'تم إرسال الطلب' : 'Request sent'}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            {language === 'ar'
              ? 'شكراً لمشاركتك فكرتك. فريقنا سيراجع تفاصيل مشروعك ويتواصل معك قريباً.'
              : 'Thank you for sharing your vision. Our team will review your project details and contact you shortly.'}
          </p>
          {requestId ? (
            <p className="mt-4 font-mono text-sm font-bold text-emerald-400">{requestId}</p>
          ) : null}
          <Button type="button" onClick={closeDialog} className="mt-5 w-full">
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <LeadProjectWizard
      isLeadMode
      onClose={closeDialog}
      onComplete={(id) => setRequestId(id || '')}
    />
  );
}

function QuickActionDialog({ isOpen, mode, onClose, user }: QuickActionDialogProps) {
  const { dir } = useTranslation();
  const isLoggedIn = Boolean(user);
  const userDisplayName = getUserDisplayName(user);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const copy = useMemo(() => {
    const isBooking = mode === 'booking';

    if (dir === 'rtl') {
      return {
        title: isBooking ? 'حجز استشارة سريع' : 'إنشاء طلب جديد',
        subtitle: isLoggedIn
          ? 'سنستخدم بيانات حسابك ونحتاج فقط تفاصيل الطلب.'
          : 'يمكنك إرسال الطلب بدون تسجيل دخول، وسنتواصل معك على الرقم المدخل.',
        topic: isBooking ? 'موضوع الاستشارة' : 'اسم المشروع أو الفكرة',
        topicPlaceholder: isBooking ? 'مثال: استشارة لمتجر إلكتروني' : 'مثال: تطبيق حجوزات أو موقع شركة',
        date: 'التاريخ المفضل',
        time: 'الوقت المفضل',
        budget: 'الميزانية المتوقعة',
        notes: isBooking ? 'ملاحظات الاستشارة' : 'تفاصيل الطلب',
        submit: isBooking ? 'إرسال الحجز' : 'إرسال الطلب',
        successTitle: isBooking ? 'تم إرسال الحجز' : 'تم إرسال الطلب',
        successBody: 'هذه بيانات تجريبية الآن. عند ربط API سيتم إنشاء السجل وإرجاع رقم مرجعي من الخادم.',
        close: 'إغلاق',
        guestName: 'الاسم الكامل',
        guestPhone: 'رقم الهاتف',
        guestEmail: 'البريد الإلكتروني',
        accountMode: 'بيانات الحساب',
      };
    }

    return {
      title: isBooking ? 'Quick consultation booking' : 'Create a new lead',
      subtitle: isLoggedIn
        ? 'We will use your account details, so you only need to add the request details.'
        : 'You can send this without logging in. We will contact you using the phone number you enter.',
      topic: isBooking ? 'Consultation topic' : 'Project or idea name',
      topicPlaceholder: isBooking ? 'Example: e-commerce consultation' : 'Example: booking app or company website',
      date: 'Preferred date',
      time: 'Preferred time',
      budget: 'Expected budget',
      notes: isBooking ? 'Consultation notes' : 'Request details',
      submit: isBooking ? 'Send booking' : 'Send lead',
      successTitle: isBooking ? 'Booking sent' : 'Lead sent',
      successBody: 'This is fake data for now. When the API is connected, the server will create the record and return a reference number.',
      close: 'Close',
      guestName: 'Full name',
      guestPhone: 'Phone number',
      guestEmail: 'Email address',
      accountMode: 'Account details',
    };
  }, [dir, isLoggedIn, mode]);

  if (!isOpen) return null;

  const updateField = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const closeDialog = () => {
    setForm(emptyForm);
    setSubmittedRef(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedRef(`${mode.toUpperCase()}-${Date.now().toString().slice(-5)}`);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" dir={dir}>
      <div className="max-h-[86vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 shadow-2xl no-scrollbar">
        <div className={`mb-4 flex items-start justify-between gap-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          <div className="min-w-0 flex-1">
            <div className={`mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-black text-primary ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              {mode === 'booking' ? <Calendar size={14} /> : <FolderPlus size={14} />}
              <span>{isLoggedIn ? copy.accountMode : dir === 'rtl' ? 'زائر' : 'Guest'}</span>
            </div>
            <h2 className="text-xl font-black text-[var(--text)] sm:text-2xl">{copy.title}</h2>
            <p className="mt-1.5 text-sm leading-6 text-[var(--text-muted)]">{copy.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={closeDialog}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            aria-label={copy.close}
          >
            <X size={18} />
          </button>
        </div>

        {submittedRef ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 sm:p-5 text-center">
            <CheckCircle2 className="mx-auto mb-3 text-emerald-400" size={42} />
            <h3 className="text-xl font-black text-[var(--text)]">{copy.successTitle}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{copy.successBody}</p>
            <p className="mt-4 font-mono text-sm font-bold text-emerald-400">{submittedRef}</p>
            <Button type="button" onClick={closeDialog} className="mt-5">
              {copy.close}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {isLoggedIn ? (
            <div className={`rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <User size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-[var(--text)]">
                      {userDisplayName}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]" dir="ltr">
                      {[user?.country_code, user?.phone].filter(Boolean).join(' ')}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label={copy.guestName}
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  required
                  dir={dir}
                />
                <div className="space-y-2">
                  <label className="ms-1 block text-xs font-medium text-[var(--text-muted)]">{copy.guestPhone}</label>
                  <PhoneInput value={form.phone} onChange={(value) => updateField('phone', value || '')} required />
                </div>
                <Input
                  label={copy.guestEmail}
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  dir="ltr"
                  className="sm:col-span-2"
                />
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label={copy.topic}
                value={form.topic}
                onChange={(event) => updateField('topic', event.target.value)}
                placeholder={copy.topicPlaceholder}
                required
                dir={dir}
                className={mode === 'lead' ? 'sm:col-span-2' : ''}
              />

              {mode === 'booking' ? (
                <>
                  <Input
                    label={copy.date}
                    type="date"
                    value={form.date}
                    onChange={(event) => updateField('date', event.target.value)}
                    required
                    dir="ltr"
                  />
                  <Input
                    label={copy.time}
                    type="time"
                    value={form.time}
                    onChange={(event) => updateField('time', event.target.value)}
                    required
                    dir="ltr"
                  />
                </>
              ) : (
                <Input
                  label={copy.budget}
                  value={form.budget}
                  onChange={(event) => updateField('budget', event.target.value)}
                  placeholder={dir === 'rtl' ? 'مثال: 1000 - 3000' : 'Example: 1000 - 3000'}
                  dir={dir}
                />
              )}

              <div className="sm:col-span-2">
                <Textarea
                  label={copy.notes}
                  value={form.notes}
                  onChange={(event) => updateField('notes', event.target.value)}
                  rows={3}
                  required={mode === 'lead'}
                  dir={dir}
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className={`w-full gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              {isSubmitting ? <Loader2 className="animate-spin" size={17} /> : mode === 'booking' ? <Calendar size={17} /> : <Phone size={17} />}
              {copy.submit}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
