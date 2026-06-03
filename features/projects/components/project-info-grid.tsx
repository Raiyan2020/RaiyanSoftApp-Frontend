import React from 'react';

interface ProjectInfoGridProps {
  industry?: string;
  industryOther?: string | null;
  markets?: string[];
  languages?: string[];
  platforms?: string[];
  t: (key: string) => string;
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-0.5 bg-[var(--surface-2)] text-[var(--text)] rounded text-xs border border-[var(--border)]">
      {children}
    </span>
  );
}

function InfoBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide font-bold block mb-1">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function ProjectInfoGrid({
  industry = '',
  industryOther,
  markets = [],
  languages = [],
  platforms = [],
  t,
}: ProjectInfoGridProps) {
  const displayIndustry = industry === 'Other' ? industryOther || industry : industry ? t(`industry.${industry}`) : '';

  return (
    <div className="app-card rounded-2xl p-4 space-y-4">
      <InfoBlock label={t('wizard.step_industry')}>
        <span className="text-[var(--text)] text-sm font-medium">{displayIndustry || '-'}</span>
      </InfoBlock>

      <InfoBlock label={t('wizard.step_markets')}>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {markets.length > 0 ? markets.map((m) => <Chip key={m}>{t(`market.${m}`)}</Chip>) : (
            <span className="text-[var(--text-muted)] text-xs">-</span>
          )}
        </div>
      </InfoBlock>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoBlock label={t('wizard.step_languages')}>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {languages.length > 0 ? languages.map((l) => <Chip key={l}>{t(`lang.${l}`)}</Chip>) : (
              <span className="text-[var(--text-muted)] text-xs">-</span>
            )}
          </div>
        </InfoBlock>

        <InfoBlock label={t('wizard.step_platforms')}>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {platforms.length > 0 ? platforms.map((p) => <Chip key={p}>{t(`platform.${p}`)}</Chip>) : (
              <span className="text-[var(--text-muted)] text-xs">-</span>
            )}
          </div>
        </InfoBlock>
      </div>
    </div>
  );
}
