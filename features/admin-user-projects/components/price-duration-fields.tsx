import React from 'react';
import { DollarSign, Clock } from 'lucide-react';
import { translateMessage } from '@/lib/i18n-utils';

interface PriceDurationFieldsProps {
  estimatedPrice: string | number;
  estimatedDuration: string | number;
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      estimatedPrice: string | number;
      estimatedDuration: string | number;
      status: any;
      projectUrl: string;
      industry: string;
      industryOther: string;
    }>
  >;
}

export default function PriceDurationFields({
  estimatedPrice,
  estimatedDuration,
  setFormData,
}: PriceDurationFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="text-xs font-medium text-[var(--text)] ms-1">{translateMessage('Estimated Price (KWD)')}</label>
        <div className="relative">
          <DollarSign size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="number"
            value={estimatedPrice}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, estimatedPrice: e.target.value }))
            }
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-3 ps-9 pe-4 text-[var(--text)] focus:border-primary focus:outline-none transition-colors"
            placeholder={translateMessage('e.g. 1500')}
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-[var(--text)] ms-1">{translateMessage('Est. Duration (Days)')}</label>
        <div className="relative">
          <Clock size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="number"
            value={estimatedDuration}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, estimatedDuration: e.target.value }))
            }
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl py-3 ps-9 pe-4 text-[var(--text)] focus:border-primary focus:outline-none transition-colors"
            placeholder={translateMessage('e.g. 21')}
          />
        </div>
      </div>
    </div>
  );
}
