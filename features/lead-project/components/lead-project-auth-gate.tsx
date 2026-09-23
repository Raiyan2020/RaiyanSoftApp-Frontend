'use client';

import React, { useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { ArrowLeft, Phone, User } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PhoneInput from '@/components/ui/phone-input';
import ErrorAlert from '@/components/ui/error-alert';
import SuccessToast from '@/components/ui/success-toast';
import { useTranslation } from '@/lib/i18nContext';
import { translateMessage } from '@/lib/i18n-utils';
import { OtpField, OTP_LENGTH, usePhoneAuth } from '@/features/auth';

interface LeadProjectAuthGateProps {
  onAuthenticated: () => void | Promise<void>;
  submitError?: string | null;
  /** Leave the auth step for the previous wizard step. */
  onBack: () => void;
}

export default function LeadProjectAuthGate({ onAuthenticated, submitError, onBack }: LeadProjectAuthGateProps) {
  const { t, dir, language } = useTranslation();
  const { step, phone, isNewUser, newUserOtpSent, loading, error, message, reset, checkPhone, submitRegistrationDetails, submitOtp } = usePhoneAuth({
    onSuccess: onAuthenticated,
  });
  const [phoneValue, setPhoneValue] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const activeError = localError || error || submitError;
  const needsNameBeforeOtp = Boolean(isNewUser && !newUserOtpSent);
  const sendOtpLabel = translateMessage('Create account and send OTP', language);

  const handlePhoneSubmit = () => {
    setLocalError(null);
    if (!phoneValue || !isValidPhoneNumber(phoneValue)) {
      setLocalError(t('auth.phone_invalid'));
      return;
    }
    checkPhone(phoneValue);
  };

  const handleNewUserOtpRequest = () => {
    setLocalError(null);
    if (!name.trim()) {
      setLocalError(t('auth.name_required'));
      return;
    }
    submitRegistrationDetails(name.trim());
  };

  const handleOtpSubmit = (code = otp) => {
    setLocalError(null);

    if (isNewUser && !newUserOtpSent) {
      handleNewUserOtpRequest();
      return;
    }

    if (isNewUser && !name.trim()) {
      setLocalError(t('auth.name_required'));
      return;
    }

    if (code.length < OTP_LENGTH) {
      setLocalError(t('auth.otp_invalid'));
      return;
    }
    submitOtp({ phone, otp: code });
  };

  return (
    <div className="flex h-full flex-col p-6 pt-10" dir={dir}>
      <button
        type="button"
        onClick={() => {
          // OTP step returns to the phone step; phone step leaves the auth gate.
          if (step === 'otp') {
            reset();
            setOtp('');
            setName('');
            setLocalError(null);
          } else {
            onBack();
          }
        }}
        disabled={loading}
        className="mb-4 inline-flex items-center gap-2 self-start text-xs font-bold text-[var(--text-muted)] transition-colors hover:text-[var(--text)] disabled:opacity-50"
      >
        <ArrowLeft size={14} className="rtl:rotate-180" aria-hidden="true" />
        {step === 'otp' ? t('auth.change_phone') : t('auth.back')}
      </button>
      <h2 className="mb-2 text-2xl font-bold text-[var(--text)]">
        {translateMessage('Sign in to continue', language)}
      </h2>
      <p className="mb-6 text-sm text-[var(--text-muted)]">
        {translateMessage('Enter your phone number to submit your project request.', language)}
      </p>

      {activeError ? (
        <ErrorAlert message={activeError} />
      ) : null}
      <SuccessToast message={message} />

      {step === 'phone' ? (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-[var(--text-muted)]">
              {t('auth.phone')}
            </label>
            <PhoneInput value={phoneValue} onChange={(value) => setPhoneValue(value || '')} />
          </div>
          <Button type="button" onClick={handlePhoneSubmit} disabled={loading} className="w-full gap-2">
            <Phone size={16} />
            {loading ? t('auth.phone_check_loading') : t('auth.continue')}
          </Button>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleOtpSubmit();
          }}
        >
          {isNewUser ? (
            <Input
              label={t('auth.full_name')}
              value={name}
              onChange={(event) => setName(event.target.value)}
              icon={<User size={16} />}
              placeholder={t('auth.name_placeholder')}
            />
          ) : null}
          {needsNameBeforeOtp ? (
            <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-start text-xs font-medium leading-5 text-primary">
              {translateMessage(
                'After entering your name, press the button below and we will send the OTP to your phone.',
                language
              )}
            </div>
          ) : (
            <OtpField
              value={otp}
              onChange={setOtp}
              onComplete={(code) => {
                if (!loading) handleOtpSubmit(code);
              }}
              disabled={loading}
            />
          )}
          <Button type="submit" disabled={loading || (needsNameBeforeOtp && !name.trim())} className="w-full">
            {loading
              ? needsNameBeforeOtp
                ? t('auth.signup_loading')
                : t('auth.verify_loading')
              : needsNameBeforeOtp
                ? sendOtpLabel
                : t('auth.verify_and_enter')}
          </Button>
        </form>
      )}
    </div>
  );
}
