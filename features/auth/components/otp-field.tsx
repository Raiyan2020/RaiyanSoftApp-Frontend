'use client';

import { useId } from 'react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useTranslation } from '@/lib/i18nContext';

// Backend OtpBuilder generates random_int(1111, 9999); VerifyOtpRequest validates size:4.
export const OTP_LENGTH = 4;

interface OtpFieldProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
}

export function OtpField({ value, onChange, onComplete, disabled }: OtpFieldProps) {
  const { t } = useTranslation();
  const id = useId();

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-bold text-[var(--text-muted)] ms-1 block">
        {t('auth.otp')}
      </label>
      <InputOTP
        id={id}
        maxLength={OTP_LENGTH}
        pattern={REGEXP_ONLY_DIGITS}
        inputMode="numeric"
        autoComplete="one-time-code"
        value={value}
        onChange={onChange}
        onComplete={onComplete}
        disabled={disabled}
        autoFocus
      >
        <InputOTPGroup>
          {Array.from({ length: OTP_LENGTH }, (_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
