import React from 'react';
import { translateMessage } from '@/lib/i18n-utils';

interface TextareaProps extends React.ComponentProps<'textarea'> {
  label?: string;
  error?: string;
}

export default function Textarea({
  label,
  error,
  className = '',
  dir,
  id,
  ...props
}: TextareaProps) {
  const reactId = React.useId();
  const fieldId = id ?? `textarea-${reactId}`;
  const errorId = `${fieldId}-error`;

  return (
    <div className="space-y-1.5 w-full">
      {label ? (
        <label htmlFor={fieldId} className="text-xs font-bold text-[var(--text-muted)] ms-1 block">
          {translateMessage(label)}
        </label>
      ) : null}
      <textarea
        id={fieldId}
        dir={dir}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full app-input rounded-xl px-4 py-3 focus:outline-none transition-colors resize-y ${
          error ? 'border-danger' : 'focus:border-primary'
        } ${className}`}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-xs text-danger ms-1 font-bold">
          {translateMessage(error)}
        </p>
      ) : null}
    </div>
  );
}
