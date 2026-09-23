import React from 'react';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { translateMessage } from '@/lib/i18n-utils';

interface WizardShellProps {
  step: number;
  direction: number;
  totalSteps: number;
  isLoading: boolean;
  errors: string[];
  nextButtonHidden: boolean;
  isLeadMode: boolean;
  isAuthenticated: boolean;
  dir: 'ltr' | 'rtl';
  language: string;
  t: (key: string) => string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  children: React.ReactNode;
  customFooterLabel?: string;
  showFooter?: boolean;
  secondaryAction?: { label: string; onClick: () => void };
}

export default function WizardShell({
  step,
  direction,
  totalSteps,
  isLoading,
  errors,
  nextButtonHidden,
  isLeadMode,
  isAuthenticated,
  dir,
  language,
  t,
  onClose,
  onPrev,
  onNext,
  children,
  customFooterLabel,
  showFooter = true,
  secondaryAction,
}: WizardShellProps) {
  const shellSizeClass = isLeadMode
    ? 'md:h-[min(82dvh,38rem)] md:max-w-xl lg:max-w-[44rem]'
    : 'md:h-[min(84dvh,42rem)] md:max-w-3xl lg:max-w-[50rem]';

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-start md:items-center bg-black/60 backdrop-blur-sm p-0 md:p-6"
      dir={dir}
      onClick={onClose}
    >
      <div
        className={`w-full h-full ${shellSizeClass} bg-[var(--surface)] text-[var(--text)] flex flex-col relative shadow-2xl overflow-hidden md:rounded-3xl border border-[var(--border)]`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* In lead mode the shell IS the /lead page, so the step <h2>s had no
            <h1> above them. As a modal it sits under the host page's own h1. */}
        {isLeadMode ? (
          <h1 className="sr-only">{translateMessage('Start your project request', language === 'ar' ? 'ar' : 'en')}</h1>
        ) : null}
        <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]">
          {/* Step 0 used to render a second X here, identical to the close
              button at the other end of the same header. */}
          {step === 0 ? (
            <div className="h-10 w-10" />
          ) : (
            <button
              type="button"
              onClick={onPrev}
              aria-label={translateMessage('Back', language === 'ar' ? 'ar' : 'en')}
              className="grid h-10 w-10 -ms-2 place-items-center rounded-xl text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            >
              {dir === 'rtl' ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
            </button>
          )}
          <div className="flex space-x-1.5 rtl:space-x-reverse">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-primary' : i < step ? 'w-1.5 bg-primary/50' : 'w-1.5 bg-[var(--surface-2)]'
                }`}
              />
            ))}
          </div>
          <div className="min-w-[40px] flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
              aria-label={translateMessage('Close dialog', language === 'ar' ? 'ar' : 'en')}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">{children}</div>

        {step !== 0 && showFooter ? (
          <div
            className={`p-3.5 sm:p-4 border-t border-[var(--border)] bg-[var(--surface)] z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.08)] transition-all duration-300 ${
              nextButtonHidden ? 'opacity-0 pointer-events-none absolute bottom-0 w-full' : 'opacity-100'
            }`}
          >
            {errors.length > 0 ? (
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="mb-4 p-3 bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] border border-[color-mix(in_srgb,var(--danger)_34%,transparent)] rounded-xl text-danger text-xs font-medium text-center"
              >
                {errors[0]}
              </motion.div>
            ) : null}

            <div className="flex gap-2">
            {secondaryAction ? (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                disabled={isLoading}
                className="shrink-0 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/15 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {secondaryAction.label}
              </button>
            ) : null}
            <button
              type="button"
              onClick={onNext}
              disabled={isLoading}
              className="min-w-0 flex-1 bg-primary text-on-primary font-bold py-3 rounded-xl shadow-[0_0_20px_rgb(var(--primary-glow-rgb) / 0.3)] hover:shadow-[0_0_25px_rgb(var(--primary-glow-rgb) / 0.5)] transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  <span>
                    {customFooterLabel || t('wizard.next')}
                  </span>
                  {customFooterLabel ? null : dir === 'rtl' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </>
              )}
            </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
