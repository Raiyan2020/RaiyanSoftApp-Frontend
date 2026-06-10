'use client';

import React, { useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { AlertCircle, Phone, ShieldCheck, User } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PhoneInput from '@/components/ui/phone-input';
import ErrorAlert from '@/components/ui/error-alert';
import { useTranslation } from '@/lib/i18nContext';
import { translateMessage } from '@/lib/i18n-utils';
import { usePhoneAuth } from '@/features/auth';

interface LeadProjectAuthGateProps {
  onAuthenticated: () => void | Promise<void>;
  submitError?: string | null;
}

export default function LeadProjectAuthGate({ onAuthenticated, submitError }: LeadProjectAuthGateProps) {
  const { t, dir } = useTranslation();
  const { step, phone, isNewUser, newUserOtpSent, loading, error, message, checkPhone, submitRegistrationDetails, submitOtp } = usePhoneAuth({
    onSuccess: onAuthenticated,
  });
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

  const handleOtpSubmit = () => {
    setLocalError(null);

    if (isNewUser && !newUserOtpSent) {
      handleNewUserOtpRequest();
      return;
    }

    if (isNewUser && !name.trim()) {
      setLocalError(t('auth.name_required'));
      return;
    }

    if (!otp.trim() || otp.trim().length < 4) {
      setLocalError(t('auth.otp_invalid'));
      return;
    }
    submitOtp({ phone, otp: otp.trim() });
  };

  return (
    <div className="flex h-full flex-col p-6 pt-10" dir={dir}>
      <h2 className="mb-2 text-2xl font-bold text-[var(--text)]">
        {dir === 'rtl' ? 'سجّل للمتابعة' : 'Sign in to continue'}
      </h2>
      <p className="mb-6 text-sm text-[var(--text-muted)]">
        {dir === 'rtl'
          ? 'أدخل رقم هاتفك لإرسال طلبك عبر النظام.'
          : 'Enter your phone number to submit your project request.'}
      </p>

      {activeError ? (
        <ErrorAlert message={activeError} />
      ) : null}

      {message ? (
        <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
          {translateMessage(message)}
        </div>
      ) : null}

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
              {dir === 'rtl'
                ? 'بعد إدخال الاسم اضغط الزر بالأسفل وسنرسل رمز التحقق إلى هاتفك.'
                : 'After entering your name, press the button below and we will send the OTP to your phone.'}
            </div>
          ) : (
            <Input
              label={t('auth.otp')}
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
              icon={<ShieldCheck size={16} />}
              dir="ltr"
              autoFocus
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
