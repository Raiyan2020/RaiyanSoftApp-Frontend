import React from 'react';
import { motion } from 'framer-motion';
import FallbackImage from '@/components/ui/fallback-image';
import { useTranslation } from '@/lib/i18nContext';

interface AppCardProps {
  id: string;
  name: string;
  version: string;
  description?: string;
  iconBg?: string;
  brandColor?: string;
  image?: string | null;
  onOpen: () => void;
}

export default function AppCard({
  name,
  version,
  description,
  image,
  onOpen,
}: AppCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="app-card p-4 rounded-2xl flex flex-col gap-5 justify-between min-h-[11rem] cursor-pointer transition-colors hover:border-primary/40"
      onClick={onOpen}
    >
      <div className="flex items-start gap-3 overflow-hidden">
        <FallbackImage
          src={image}
          alt={name}
          className="h-12 w-12 shrink-0 rounded-xl border border-[var(--border)] shadow-inner"
        />
        <div className="min-w-0">
          <h2 className="text-[var(--text)] font-semibold text-base truncate pe-2 rtl:pe-0 rtl:ps-2">{name}</h2>
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
