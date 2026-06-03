import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface WizardIndustryStepProps {
  industries: string[];
  selectedIndustry: string;
  industryOther: string;
  t: (key: string) => string;
  onSelectIndustry: (ind: string) => void;
  onChangeOther: (val: string) => void;
}

export default function WizardIndustryStep({
  industries,
  selectedIndustry,
  industryOther,
  t,
  onSelectIndustry,
  onChangeOther,
}: WizardIndustryStepProps) {
  return (
    <div className="flex flex-col h-full p-6 pt-10 overflow-y-auto no-scrollbar pb-32">
      <h2 className="text-2xl font-bold text-[var(--text)] mb-6">{t('wizard.step_industry')}</h2>
      <div className="grid grid-cols-2 gap-3">
        {industries.map((ind) => {
          const isSelected = selectedIndustry === ind;
          const translated = t(`industry.${ind}`);
          const label = translated === `industry.${ind}` ? ind : translated;
          return (
            <button
              type="button"
              key={ind}
              onClick={() => onSelectIndustry(ind)}
              className={`p-4 rounded-xl border font-medium transition-all duration-200 text-start flex flex-col justify-between h-24 ${
                isSelected
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-[var(--surface-3)] border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-3)]'
              }`}
            >
              <span className="text-sm font-semibold leading-tight">{label}</span>
              {isSelected ? (
                <div className="self-end bg-white/20 rounded-full p-1">
                  <Check size={12} />
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      {selectedIndustry === 'Other' ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase mb-2 block">{t('wizard.specify')}</label>
          <input
            autoFocus
            type="text"
            value={industryOther || ''}
            onChange={(e) => onChangeOther(e.target.value)}
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text)] focus:border-primary focus:outline-none"
            placeholder={t('wizard.specify_placeholder')}
          />
        </motion.div>
      ) : null}
    </div>
  );
}
