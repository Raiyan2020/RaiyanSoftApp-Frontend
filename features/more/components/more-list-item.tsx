import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';

interface MoreListItemProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
  rightElement?: React.ReactNode;
  disabled?: boolean;
}

export default function MoreListItem({
  icon: Icon,
  label,
  onClick,
  className = '',
  rightElement,
  disabled = false,
}: MoreListItemProps) {
  const { dir } = useTranslation();
  return (
    <motion.button
      type="button"
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-between p-4 bg-[var(--surface)] border-b border-[var(--border)] last:border-0 first:rounded-t-2xl last:rounded-b-2xl transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--surface-2)] cursor-pointer'
      } ${className}`}
    >
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)] border border-[var(--border)]">
          <Icon size={20} />
        </div>
        <span className="text-sm font-medium text-[var(--text)]">{label}</span>
      </div>

      <div className="flex items-center text-[var(--text-muted)]">
        {rightElement}
        <ChevronRight size={18} className={`ms-2 opacity-70 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
      </div>
    </motion.button>
  );
}
