import React from 'react';
import { motion } from 'framer-motion';
import SafeImage from '@/components/ui/safe-image';

interface ProjectListItemProps {
  name: string;
  description: string;
  logoUrl: string;
  link: string;
}

export default function ProjectListItem({ name, description, logoUrl, link }: ProjectListItemProps) {
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="app-card p-4 rounded-2xl flex items-center gap-3 transition-colors cursor-pointer hover:border-primary/40 min-h-[6rem]"
    >
      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[var(--border)] relative bg-[var(--surface-2)] shadow-md">
        <SafeImage src={logoUrl} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[var(--text)] font-bold text-sm truncate">{name}</h4>
        <p className="text-[var(--text-muted)] text-xs truncate">{description}</p>
      </div>
    </motion.a>
  );
}
