'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, CheckCircle2, MessageCircle, X } from 'lucide-react';
import Button from '@/components/ui/button';
import { useUserSettings } from '@/features/settings';
import { useTranslation } from '@/lib/i18nContext';

interface LeadContactChoiceModalProps {
  requestId?: string;
  onClose: () => void;
}

// F-LEAD-03: shown once a project request is saved successfully. Offers
// exactly two follow-up options; closing without choosing still leaves the
// request saved (the caller only renders this after a successful create).
export default function LeadContactChoiceModal({ requestId, onClose }: LeadContactChoiceModalProps) {
  const { t, dir } = useTranslation();
  const router = useRouter();
  const { settings } = useUserSettings();
  const whatsappNumber = settings?.whatsapp_number?.trim();

  const handleBooking = () => {
    onClose();
    router.push('/book');
  };

  const handleWhatsApp = () => {
    if (!whatsappNumber) return;
    const text = requestId
      ? t('contact_choice.title') + ` #${requestId}`
      : t('contact_choice.title');
    const digits = whatsappNumber.replace(/[^\d]/g, '');
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[170] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      dir={dir}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t('contact_choice.close')}
          className="ms-auto mb-2 grid h-8 w-8 place-items-center rounded-xl border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
        >
          <X size={16} />
        </button>

        <CheckCircle2 className="mx-auto mb-3 text-success" size={42} />
        <h3 className="text-xl font-black text-[var(--text)]">{t('contact_choice.title')}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{t('contact_choice.subtitle')}</p>

        <div className="mt-5 space-y-3">
          <Button type="button" onClick={handleBooking} className="w-full gap-2">
            <Calendar size={17} />
            {t('contact_choice.book')}
          </Button>

          {whatsappNumber ? (
            <Button
              type="button"
              onClick={handleWhatsApp}
              className="w-full gap-2 text-white shadow-none hover:opacity-90"
              style={{ backgroundColor: '#25D366' }}
            >
              <MessageCircle size={17} />
              {t('contact_choice.whatsapp')}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
