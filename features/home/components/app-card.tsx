import React from 'react';
import { motion } from 'framer-motion';
import { Box } from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';

interface AppCardProps {
  id: string;
  name: string;
  version: string;
  description?: string;
  iconBg?: string;
  brandColor?: string;
  onOpen: () => void;
}

export default function AppCard({
  name,
  version,
  description,
  brandColor,
  onOpen,
}: AppCardProps) {
  const finalColor = brandColor || '#1DB7F0';
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="app-card p-4 rounded-2xl flex flex-col gap-5 justify-between min-h-[11rem] cursor-pointer transition-colors hover:border-primary/40"
      onClick={onOpen}
    >
      <div className="flex items-start gap-3 overflow-hidden">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner shrink-0 transition-colors duration-300"
          style={{
            backgroundColor: finalColor,
            border: `1px solid ${finalColor}40`,
            boxShadow: `0 0 12px ${finalColor}30`,
          }}
        >
          <Box className="text-[var(--text)] opacity-90" size={20} />
        </div>
        <div className="min-w-0">
          <h3 className="text-[var(--text)] font-semibold text-base truncate pe-2 rtl:pe-0 rtl:ps-2">{name}</h3>
          <p className="text-[var(--text-muted)] text-sm line-clamp-2">{description || version}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        className="self-start bg-[var(--surface-2)] hover:bg-primary/20 text-xs font-medium text-[var(--text)] px-4 py-2 rounded-lg transition-colors border border-[var(--border)] shrink-0"
      >
        {t('home.open')}
      </button>
    </motion.div>
  );
}
