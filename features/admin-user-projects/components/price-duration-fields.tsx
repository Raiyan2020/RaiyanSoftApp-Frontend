import React from 'react';
import { DollarSign, Clock } from 'lucide-react';
import { translateMessage } from '@/lib/i18n-utils';
import Input from '@/components/ui/input';

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
        <Input
          type="number"
          value={estimatedPrice}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, estimatedPrice: e.target.value }))
          }
          icon={<DollarSign size={14} />}
          placeholder={translateMessage('e.g. 1500')}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-[var(--text)] ms-1">{translateMessage('Est. Duration (Days)')}</label>
        <Input
          type="number"
          value={estimatedDuration}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, estimatedDuration: e.target.value }))
          }
          icon={<Clock size={14} />}
          placeholder={translateMessage('e.g. 21')}
        />
      </div>
    </div>
  );
}
