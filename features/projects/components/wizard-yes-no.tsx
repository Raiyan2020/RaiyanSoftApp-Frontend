import React from 'react';
import { Check } from 'lucide-react';

interface WizardYesNoProps {
  title: string;
  selected: boolean | null;
  t: (key: string) => string;
  onSelect: (val: boolean) => void;
}

export default function WizardYesNo({ title, selected, t, onSelect }: WizardYesNoProps) {
  const options = [
    { label: t('wizard.yes'), value: true },
    { label: t('wizard.no'), value: false },
  ];

  return (
    <div className="flex flex-col h-full p-6 pt-10">
      <h2 className="text-2xl font-bold text-[var(--text)] mb-6">{title}</h2>
      <div className="space-y-3">
        {options.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <button
              type="button"
              key={opt.label}
              onClick={() => onSelect(opt.value)}
              className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                isSelected
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-[var(--surface-3)] border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-3)]'
              }`}
            >
              <span className="font-medium text-lg">{opt.label}</span>
              {isSelected ? <Check size={20} className="text-primary" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
