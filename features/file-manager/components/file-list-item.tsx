import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Trash2, Download } from 'lucide-react';
import SafeImage from '@/components/ui/safe-image';
import { UploadedFile } from '../hooks/use-file-manager';

interface FileListItemProps {
  file: UploadedFile;
  dir: string;
  isImage: (type: string) => boolean;
  formatSize: (size: number) => string;
  onDelete: (file: UploadedFile) => void;
}

export default function FileListItem({ file, dir, isImage, formatSize, onDelete }: FileListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
      className="app-card rounded-xl p-3 flex items-center gap-3 group"
    >
      <div className="w-12 h-12 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
        {isImage(file.type) ? (
          <SafeImage src={file.url} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <FileText size={20} className="text-[var(--text-muted)]" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-[var(--text)] text-sm font-medium truncate mb-0.5">{file.name}</h4>
        <p className="text-[var(--text-muted)] text-xs flex items-center gap-2">
          <span>{formatSize(file.size)}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
          <span className="uppercase">{file.type.split('/')[1] || 'FILE'}</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-[var(--surface-2)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          <Download size={16} />
        </a>
        <button
          type="button"
          onClick={() => onDelete(file)}
          className="p-2 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}
