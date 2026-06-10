import React from 'react';
import Link from 'next/link';
import { Eye, LayoutGrid, Link as LinkIcon, Edit2 } from 'lucide-react';
import Avatar from '@/components/ui/avatar';
import { UserProject } from '@/lib/userProjectsStore';

interface UserProjectsRowProps {
  project: UserProject;
  onEdit: (project: UserProject) => void;
  formatDate: (ts: number) => string;
  variant?: 'desktop' | 'mobile';
}

export default function UserProjectsRow({ project, onEdit, formatDate, variant = 'desktop' }: UserProjectsRowProps) {
  const detailHref = project.ownerId
    ? `/admin/user-projects/${encodeURIComponent(project.ownerId)}/${encodeURIComponent(project.id)}`
    : '/admin/user-projects';
  const canEditProject = true;

  if (variant === 'mobile') {
    const isCancelled = project.status === 'cancelled';

    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 shrink-0 ${project.iconBg || 'bg-[var(--surface-3)]'} rounded-lg flex items-center justify-center text-[var(--text)] border border-[var(--border)] shadow-inner`}>
              <LayoutGrid size={18} className="opacity-80" />
            </div>
            <div className="min-w-0">
              <Link href={detailHref} className="block font-bold text-[var(--text)] hover:text-primary transition-colors truncate">
                {project.name}
              </Link>
              {project.industry ? (
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {project.industry === 'Other' ? project.industryOther : project.industry}
                </p>
              ) : null}
            </div>
          </div>
          <span className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border ${isCancelled ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
            {project.status}
          </span>
        </div>

        {/* Details */}
        <div className="rounded-lg bg-[var(--surface)] border border-[var(--border)] px-3 py-2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Owner</span>
            <span className="font-medium text-[var(--text)] truncate max-w-[60%]">{project.ownerName}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Pricing</span>
            <span className="font-medium text-[var(--text)]">{project.estimatedPrice ? `${project.estimatedPrice.toLocaleString()} KWD` : '—'}</span>
          </div>
          {project.estimatedDuration ? (
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Duration</span>
              <span className="font-medium text-[var(--text)]">{project.estimatedDuration} days</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--border)]">
            <span className="text-[var(--text-muted)]">Created</span>
            <span className="text-[var(--text-muted)]">{formatDate(project.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={detailHref}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-medium text-[var(--text)] hover:border-primary/30 hover:text-primary transition-colors"
          >
            <Eye size={14} />
            View
          </Link>
          {canEditProject ? (
            <button
              type="button"
              onClick={() => onEdit(project)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-medium text-[var(--text)] hover:border-primary/30 hover:text-primary transition-colors"
            >
              <Edit2 size={14} />
              Edit
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
      <tr className="hover:bg-white/[0.02] transition-colors group">
        <td className="p-5">
          <Link href={detailHref} className="flex items-center gap-3 group/project">
            <div
              className={`w-10 h-10 ${
                project.iconBg || 'bg-[var(--surface-3)]'
              } rounded-lg flex items-center justify-center text-[var(--text)] border border-[var(--border)] shadow-inner`}
            >
              <LayoutGrid size={18} className="opacity-80" />
            </div>
            <div>
              <div className="font-medium text-[var(--text)] group-hover/project:text-primary transition-colors">{project.name}</div>
              <div className="text-[var(--text-muted)] text-xs flex items-center gap-1">
                {project.projectUrl ? <LinkIcon size={10} /> : null}
                {project.version || 'v1.0.0'}
                {project.industry ? (
                  <span className="text-[var(--text-muted)]">
                    • {project.industry === 'Other' ? project.industryOther : project.industry}
                  </span>
                ) : null}
              </div>
            </div>
          </Link>
        </td>
        <td className="p-5">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
              project.status === 'cancelled'
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}
          >
            {project.status}
          </span>
        </td>
        <td className="p-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-[var(--text)] text-xs font-medium">
              {project.estimatedPrice ? `${project.estimatedPrice.toLocaleString()} KWD` : '—'}
            </span>
            <span className="text-[var(--text-muted)] text-[10px]">
              {project.estimatedDuration ? `${project.estimatedDuration} days` : '—'}
            </span>
          </div>
        </td>
        <td className="p-5">
          <div className="flex items-center gap-2">
            <Avatar name={project.ownerName} size="sm" className="w-6 h-6 text-[10px]" />
            <div>
              <div className="text-[var(--text)] text-xs font-medium">{project.ownerName}</div>
              <div className="text-[var(--text-muted)] text-[10px]">{project.ownerEmail}</div>
            </div>
          </div>
        </td>
        <td className="p-5 text-[var(--text-muted)] text-xs">{formatDate(project.createdAt)}</td>
        <td className="p-5 text-right">
          <div className="flex items-center justify-end gap-2">
            <Link
              href={detailHref}
              className="p-2 bg-[var(--surface-3)] hover:bg-primary/20 rounded-lg text-[var(--text-muted)] hover:text-primary transition-colors border border-[var(--border)] hover:border-primary/30"
              title="Open operations"
            >
              <Eye size={16} />
            </Link>
            {canEditProject ? (
              <button
                type="button"
                onClick={() => onEdit(project)}
                className="p-2 bg-[var(--surface-3)] hover:bg-white/5 rounded-lg text-[var(--text-muted)] hover:text-primary transition-colors border border-[var(--border)] hover:border-primary/30"
                title="Edit project"
              >
                <Edit2 size={16} />
              </button>
            ) : null}
          </div>
        </td>
      </tr>
  );
}
