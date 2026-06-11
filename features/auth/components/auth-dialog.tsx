'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Phone, ShieldCheck, User, X } from 'lucide-react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PhoneInput from '@/components/ui/phone-input';
import ErrorAlert from '@/components/ui/error-alert';
import SuccessToast from '@/components/ui/success-toast';
import { useTranslation } from '@/lib/i18nContext';
import { usePhoneAuth } from '../hooks/use-phone-auth';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const { t, dir } = useTranslation();
  const {
    step,
    phone,
    isNewUser,
    newUserOtpSent,
    loading,
    error,
    message,
    reset,
    checkPhone,
    submitRegistrationDetails,
    submitOtp,
  } = usePhoneAuth();
  const [phoneValue, setPhoneValue] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      reset();
      setPhoneValue('');
      setName('');
      setOtp('');
      setLocalError(null);
    }
  }, [isOpen, reset]);

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

    submitOtp({
      phone,
      otp: otp.trim(),
    });
  };

  const activeError = localError || error;
  const needsNameBeforeOtp = Boolean(isNewUser && !newUserOtpSent);
  const sendOtpLabel = dir === 'rtl' ? 'إنشاء الحساب وإرسال رمز التحقق' : 'Create account and send OTP';

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          dir={dir}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 18 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 18 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-visible"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              aria-label={t('auth.close')}
            >
              <X size={20} />
            </button>

            <div className="mb-6 pe-9 rtl:pe-0 rtl:ps-9">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-5">
                {step === 'phone' ? (
                  <Phone size={26} className="text-primary" />
                ) : (
                  <ShieldCheck size={26} className="text-primary" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-[var(--text)] mb-2">
                {step === 'phone'
                  ? t('auth.phone_dialog_title')
                  : t('auth.otp_dialog_title')}
              </h2>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                {step === 'phone'
                  ? t('auth.phone_dialog_subtitle')
                  : isNewUser
                    ? t('auth.otp_new_user_subtitle')
                    : t('auth.otp_existing_user_subtitle')}
              </p>
            </div>

            {activeError ? (
              <ErrorAlert message={activeError} />
            ) : null}
            <SuccessToast message={message} />

            {step === 'phone' ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handlePhoneSubmit();
                }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-xs text-[var(--text-muted)] ms-1 block font-medium">
                    {t('auth.phone')}
                  </label>
                  <PhoneInput
                    value={phoneValue}
                    onChange={setPhoneValue}
                    placeholder={t('auth.phone_placeholder')}
                    autoComplete="tel"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handlePhoneSubmit}
                  isLoading={loading}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? t('auth.phone_check_loading') : t('auth.continue')}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleOtpSubmit();
                }}
                className="space-y-5"
              >
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setOtp('');
                    setName('');
                    setLocalError(null);
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  <ArrowLeft size={14} className={dir === 'rtl' ? 'rotate-180' : ''} />
                  {t('auth.change_phone')}
                </button>

                <div className="rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3 text-sm font-mono text-[var(--text)] text-left" dir="ltr">
                  {phone}
                </div>

                {isNewUser ? (
                  <Input
                    label={t('auth.full_name')}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    icon={<User size={16} />}
                    placeholder={t('auth.name_placeholder')}
                    autoComplete="name"
                    dir={dir}
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
                    placeholder="123456"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    dir="ltr"
                    autoFocus
                  />
                )}

                <Button
                  type="submit"
                  isLoading={loading}
                  disabled={loading || (needsNameBeforeOtp && !name.trim())}
                  className="w-full"
                >
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
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
