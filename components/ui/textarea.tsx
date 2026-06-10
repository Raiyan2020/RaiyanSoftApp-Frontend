import React from 'react';
import { translateMessage } from '@/lib/i18n-utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({
  label,
  error,
  className = '',
  dir,
  ...props
}: TextareaProps) {
  return (
    <div className="space-y-2 w-full">
      {label ? (
        <label className="text-xs text-[var(--text-muted)] ms-1 block font-medium">
          {translateMessage(label)}
        </label>
      ) : null}
      <textarea
        dir={dir}
        className={`w-full app-input rounded-xl px-4 py-3 focus:outline-none transition-all resize-none ${
          error
            ? 'border-red-500/50 focus:border-red-500'
            : 'focus:border-primary'
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="text-[10px] text-red-400 ms-1 mt-0.5 font-medium">{translateMessage(error)}</p>
      ) : null}
    </div>
  );
}
