import React from 'react';
import { translateMessage } from '@/lib/i18n-utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  className = '',
  dir,
  id,
  ...props
}: InputProps) {
  // A generated id lets the label actually point at its control, so clicking
  // the label focuses the field and screen readers announce the pairing.
  const reactId = React.useId();
  const inputId = id ?? `input-${reactId}`;
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-1.5 w-full">
      {label ? (
        <label htmlFor={inputId} className="text-xs font-bold text-[var(--text-muted)] ms-1 block">
          {translateMessage(label)}
        </label>
      ) : null}
      <div className="relative">
        {icon ? (
          <div className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        ) : null}
        <input
          id={inputId}
          dir={dir}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`w-full app-input rounded-xl min-h-11 ${
            icon ? 'ps-10 pe-4' : 'px-4'
          } py-2.5 focus:outline-none transition-colors ${
            error ? 'border-danger' : 'focus:border-primary'
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p id={errorId} className="text-xs text-danger ms-1 font-bold">
          {translateMessage(error)}
        </p>
      ) : null}
    </div>
  );
}
