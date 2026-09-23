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
import { OtpField, OTP_LENGTH, usePhoneAuth } from '@/features/auth';

interface BookingAuthGateProps {
  onAuthenticated: () => void | Promise<void>;
  submitError?: string | null;
  /** Leave the auth step for the previous wizard step. */
  onBack: () => void;
}

export default function BookingAuthGate({ onAuthenticated, submitError, onBack }: BookingAuthGateProps) {
  const { t, dir } = useTranslation();
  const { step, phone, isNewUser, newUserOtpSent, loading, error, message, reset, checkPhone, submitRegistrationDetails, submitOtp } =
    usePhoneAuth({ onSuccess: onAuthenticated });
  const [phoneValue, setPhoneValue] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const activeError = localError || error || submitError;
  const needsNameBeforeOtp = Boolean(isNewUser && !newUserOtpSent);
  const sendOtpLabel = dir === 'rtl' ? 'إنشاء الحساب وإرسال رمز التحقق' : 'Create account and send OTP';

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
    <div className="flex h-full flex-col p-5 sm:p-6 pt-8" dir={dir}>
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
        {dir === 'rtl' ? 'سجّل للحجز' : 'Sign in to finish booking'}
      </h2>
      <p className="mb-5 text-sm text-[var(--text-muted)]">
        {dir === 'rtl'
          ? 'أدخل رقم هاتفك لإكمال الحجز أو إنشاء حساب جديد.'
          : 'Enter your phone number to complete the booking or create a new account.'}
      </p>

      {activeError ? (
        <ErrorAlert message={activeError} />
      ) : null}
      <SuccessToast message={message} />

      {step === 'phone' ? (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-[var(--text-muted)]">{t('auth.phone')}</label>
            <PhoneInput
              value={phoneValue}
              onChange={(value) => setPhoneValue(value || '')}
              useManagedCountries={false}
            />
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
              {dir === 'rtl'
                ? 'بعد إدخال الاسم اضغط الزر بالأسفل وسنرسل رمز التحقق إلى هاتفك.'
                : 'After entering your name, press the button below and we will send the OTP to your phone.'}
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
