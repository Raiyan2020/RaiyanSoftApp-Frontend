import React from 'react';
import { Timer, BarChart2, MessageCircle, MousePointerClick, Edit3, CheckCircle2, Info } from 'lucide-react';

interface WizardIntroProps {
  t: (key: string) => string;
  onStart: () => void;
}

export default function WizardIntro({ t, onStart }: WizardIntroProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar pb-24">
      <div className="flex flex-col items-center text-center p-6 gap-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text)] mb-2 leading-tight">{t('wizard.start_title')}</h2>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-xs mx-auto">
            {t('wizard.start_subtitle')}
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="bg-[var(--surface-3)] border border-[var(--border)] p-3 rounded-xl flex flex-col items-center justify-center gap-2">
              <Timer size={20} className="text-primary" />
              <span className="text-[11px] font-bold text-[var(--text)] leading-tight">{t('wizard.feat_time')}</span>
            </div>
            <div className="bg-[var(--surface-3)] border border-[var(--border)] p-3 rounded-xl flex flex-col items-center justify-center gap-2">
              <BarChart2 size={20} className="text-success" />
              <span className="text-[11px] font-bold text-[var(--text)] leading-tight">{t('wizard.feat_analysis')}</span>
            </div>
            <div className="bg-[var(--surface-3)] border border-[var(--border)] p-3 rounded-xl flex flex-col items-center justify-center gap-2">
              <MessageCircle size={20} className="text-info" />
              <span className="text-[11px] font-bold text-[var(--text)] leading-tight">{t('wizard.feat_reply')}</span>
            </div>
          </div>

          <ol className="flex items-start w-full mt-3 px-2">
            {[
              { Icon: MousePointerClick, label: t('wizard.step_1_label') },
              { Icon: Edit3, label: t('wizard.step_2_label') },
              { Icon: CheckCircle2, label: t('wizard.step_3_label') },
            ].map(({ Icon, label }, i) => (
              <React.Fragment key={i}>
                {i > 0 && <li aria-hidden className="flex-1 h-px mt-[18px] mx-1 bg-[var(--border)]" />}
                <li className="flex flex-col items-center gap-1.5 w-20 shrink-0">
                  <div className="w-9 h-9 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-primary">
                    <Icon size={16} />
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] font-medium leading-tight">{label}</span>
                </li>
              </React.Fragment>
            ))}
          </ol>
        </div>

        <div className="bg-[color-mix(in_srgb,var(--warning)_12%,transparent)] border border-[color-mix(in_srgb,var(--warning)_30%,transparent)] p-3 rounded-xl w-full text-start flex items-start gap-3">
          <Info size={16} className="text-warning shrink-0 mt-0.5" />
          <div>
            <span className="text-warning text-xs font-bold block mb-0.5">{t('wizard.start_note')}</span>
            <p className="text-warning text-xs leading-relaxed">{t('wizard.start_desc')}</p>
          </div>
        </div>

        <div className="w-full pt-2">
          <button
            type="button"
            onClick={onStart}
            className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl shadow-[0_0_20px_rgb(var(--primary-glow-rgb)/0.3)] hover:shadow-[0_0_25px_rgb(var(--primary-glow-rgb)/0.5)] transition-all"
          >
            {t('wizard.start_btn')}
          </button>
          <p className="text-[11px] text-[var(--text-muted)] mt-2 font-medium">{t('wizard.no_commit')}</p>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
