import React from 'react';
import { Info } from 'lucide-react';
import SafeImage from '@/components/ui/safe-image';
import { useTranslation } from '@/lib/i18nContext';

export default function ChatHeader() {
  const { t } = useTranslation();

  return (
    <div className="bg-[var(--surface)] backdrop-blur-md border-b border-[var(--border)] px-4 py-3 flex items-center justify-between z-30 shrink-0 h-[72px]">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[var(--border)]">
            <SafeImage
              src="https://raiyansoft.com/wp-content/uploads/2024/05/cropped-App-Icon-1.png"
              alt="Support"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute bottom-0 end-0 w-3 h-3 bg-emerald-500 border-2 border-[var(--surface)] rounded-full" />
        </div>
        <div>
          <h2 className="text-[var(--text)] font-bold text-sm leading-tight">{t('chat.header')}</h2>
          <div className="flex items-center gap-1">
            <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-wide font-medium">{t('chat.team')}</p>
            <span className="text-emerald-500 text-[10px]">- {t('chat.online')}</span>
          </div>
        </div>
      </div>
      <button type="button" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
        <Info size={20} />
      </button>
    </div>
  );
}
