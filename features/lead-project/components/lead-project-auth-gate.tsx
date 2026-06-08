'use client';

import React, { useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { AlertCircle, Phone, ShieldCheck, User } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PhoneInput from '@/components/ui/phone-input';
import { useTranslation } from '@/lib/i18nContext';
import { usePhoneAuth } from '@/features/auth/hooks/use-phone-auth';

interface LeadProjectAuthGateProps {
  onAuthenticated: () => void;
}

export default function LeadProjectAuthGate({ onAuthenticated }: LeadProjectAuthGateProps) {
  const { t, dir } = useTranslation();
  const { step, phone, isNewUser, newUserOtpSent, loading, error, message, checkPhone, submitRegistrationDetails, submitOtp } = usePhoneAuth({
    onSuccess: onAuthenticated,
  });
  const [phoneValue, setPhoneValue] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const activeError = localError || error;

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
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          <AlertCircle size={16} />
          <span>{activeError}</span>
        </div>
      ) : null}

      {message ? (
        <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
          {message}
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
        <div className="space-y-4">
          {isNewUser ? (
            <Input
              label={t('auth.full_name')}
              value={name}
              onChange={(event) => setName(event.target.value)}
              icon={<User size={16} />}
              placeholder={t('auth.name_placeholder')}
            />
          ) : null}
          <Input
            label={t('auth.otp')}
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
            icon={<ShieldCheck size={16} />}
            dir="ltr"
            disabled={Boolean(isNewUser && !newUserOtpSent)}
          />
          {isNewUser && !newUserOtpSent ? (
            <p className="text-start text-xs leading-5 text-[var(--text-muted)]">
              {t('auth.otp_waiting_for_name')}
            </p>
          ) : null}
          <Button type="button" onClick={handleOtpSubmit} disabled={loading} className="w-full">
            {loading
              ? isNewUser && !newUserOtpSent
                ? t('auth.signup_loading')
                : t('auth.verify_loading')
              : isNewUser && !newUserOtpSent
                ? t('auth.send_otp')
                : t('auth.verify_and_enter')}
          </Button>
        </div>
      )}
    </div>
  );
}
