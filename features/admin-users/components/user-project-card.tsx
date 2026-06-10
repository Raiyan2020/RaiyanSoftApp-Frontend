import React from 'react';
import { LayoutGrid, ExternalLink } from 'lucide-react';
import { UserProject } from '@/lib/userProjectsStore';
import { translateMessage } from '@/lib/i18n-utils';

interface UserProjectCardProps {
  project: UserProject;
  formatDate: (ts: number) => string;
}

export default function UserProjectCard({ project, formatDate }: UserProjectCardProps) {
  return (
    <div className="bg-[var(--surface-3)] border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-3 group hover:border-[var(--border)] transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 ${
              project.iconBg || 'bg-[var(--surface-3)]'
            } rounded-lg flex items-center justify-center text-[var(--text)] border border-[var(--border)]`}
          >
            <LayoutGrid size={20} />
          </div>
          <div>
            <h4 className="font-bold text-[var(--text)] text-sm">{project.name}</h4>
            <p className="text-[var(--text-muted)] text-xs">{project.industry || translateMessage('General App')}</p>
          </div>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
            project.status === 'cancelled'
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}
        >
          {translateMessage(project.status || 'Draft')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-1">
        <div className="bg-[var(--surface-2)] p-2 rounded-lg border border-[var(--border)]">
          <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wide">{translateMessage('Platform')}</span>
          <span className="text-xs text-[var(--text)] truncate block">{project.platforms?.join(', ') || translateMessage('Web & Mobile')}</span>
        </div>
        <div className="bg-[var(--surface-2)] p-2 rounded-lg border border-[var(--border)]">
          <span className="text-[10px] text-[var(--text-muted)] block uppercase tracking-wide">{translateMessage('Updated')}</span>
          <span className="text-xs text-[var(--text)] truncate block">{formatDate(project.updatedAt)}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-[var(--border)] flex justify-end">
        {project.projectUrl ? (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-primary hover:text-[var(--text)] flex items-center gap-1 transition-colors"
          >
            {translateMessage('Open Project')} <ExternalLink size={12} />
          </a>
        ) : (
          <span className="text-xs text-[var(--text-muted)] cursor-not-allowed">{translateMessage('No URL')}</span>
        )}
      </div>
    </div>
  );
}
