import React from 'react';
import { Box, ExternalLink, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectHeaderProps {
  name: string;
  version?: string;
  brandColor?: string;
  projectUrl?: string | null;
  isEditingName: boolean;
  nameDraft: string;
  t: (key: string) => string;
  onOpenUrl: () => void;
  onStartEditName: () => void;
  onChangeNameDraft: (val: string) => void;
  onSaveName: () => void;
  onCancelEditName: () => void;
  canEdit?: boolean;
}

export default function ProjectHeader({
  name,
  version,
  brandColor,
  projectUrl,
  isEditingName,
  nameDraft,
  t,
  onOpenUrl,
  onStartEditName,
  onChangeNameDraft,
  onSaveName,
  onCancelEditName,
  canEdit = true,
}: ProjectHeaderProps) {
  const finalColor = brandColor || '#1DB7F0';

  return (
    <div className="app-card rounded-3xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <motion.button
          type="button"
          whileTap={projectUrl ? { scale: 0.95 } : {}}
          onClick={onOpenUrl}
          disabled={!projectUrl}
          className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner shrink-0 relative overflow-hidden group ${
            projectUrl ? 'cursor-pointer' : 'cursor-default'
          }`}
          style={{
            backgroundColor: finalColor,
            border: `1px solid ${finalColor}40`,
            boxShadow: `0 0 20px ${finalColor}30`,
          }}
        >
          <Box className="text-[var(--text)] opacity-90 relative z-10" size={32} />
          {projectUrl ? (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <ExternalLink className="text-[var(--text)]" size={24} />
            </div>
          ) : null}
        </motion.button>

        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={nameDraft}
                onChange={(e) => onChangeNameDraft(e.target.value)}
                className="w-full app-input border-primary rounded-lg px-3 py-2 font-bold text-lg focus:outline-none"
                autoFocus
              />
              <div className="flex gap-2">
                <button type="button" onClick={onSaveName} className="bg-primary px-3 py-1 rounded text-xs text-white font-medium">
                  {t('project.save')}
                </button>
                <button type="button" onClick={onCancelEditName} className="bg-[var(--surface-2)] border border-[var(--border)] px-3 py-1 rounded text-xs text-[var(--text)]">
                  {t('project.cancel')}
                </button>
              </div>
            </div>
          ) : canEdit ? (
            <button
              type="button"
              onClick={onStartEditName}
              className="group cursor-pointer rounded-lg p-1 -ms-1 hover:bg-[var(--surface-2)] transition-colors w-full text-start"
            >
              <h2 className="text-2xl font-bold text-[var(--text)] leading-tight break-words flex items-center gap-2">
                {name}
                <Edit2 size={14} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </h2>
              <p className="text-[var(--text-muted)] text-xs mt-1">{version || 'v1.0.0'}</p>
            </button>
          ) : (
            <div className="rounded-lg p-1 -ms-1 w-full text-start">
              <h2 className="text-2xl font-bold text-[var(--text)] leading-tight break-words">
                {name}
              </h2>
              <p className="text-[var(--text-muted)] text-xs mt-1">{version || 'v1.0.0'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
