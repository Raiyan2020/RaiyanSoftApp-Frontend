import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Edit2, Trash2 } from 'lucide-react';
import { Role } from '@/lib/roleStore';
import { translateMessage } from '@/lib/i18n-utils';
import { formatRoleLabel } from '@/features/admin-employees/utils/employee-helpers';

interface RoleCardProps {
  role: Role;
  onOpenModal: (role?: Role) => void;
  onDeleteRole: (id: string) => void;
}

export default function RoleCard({ role, onOpenModal, onDeleteRole }: RoleCardProps) {
  return (
    <motion.div
      layout
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-lg hover:border-[var(--border)] transition-colors group relative overflow-hidden flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-[var(--surface-3)] rounded-xl flex items-center justify-center border border-[var(--border)] text-primary">
          <ShieldCheck size={24} />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onOpenModal(role)}
            className="p-2 bg-[var(--surface-3)] hover:bg-primary/20 hover:text-primary rounded-lg text-[var(--text-muted)] transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDeleteRole(role.id)}
            className="p-2 bg-[var(--surface-3)] hover:bg-[color-mix(in_srgb,var(--danger)_20%,transparent)] hover:text-danger rounded-lg text-[var(--text-muted)] transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h2 className="text-[var(--text)] font-bold text-lg mb-1">{translateMessage(formatRoleLabel(role.name))}</h2>
      <p className="text-[var(--text-muted)] text-sm mb-4 h-10 line-clamp-2">{role.description ? translateMessage(role.description) : null}</p>

      <div className="mt-auto">
        <h3 className="text-[11px] uppercase text-[var(--text-muted)] font-bold mb-2">{translateMessage('Permissions')}</h3>
        <div className="flex flex-wrap gap-2">
          {role.permissions.slice(0, 3).map((perm) => (
            <span
              key={perm}
              className="text-[11px] bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text)] px-2 py-1 rounded-md"
            >
              {perm}
            </span>
          ))}
          {role.permissions.length > 3 ? (
            <span className="text-[11px] bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text-muted)] px-2 py-1 rounded-md">
              +{role.permissions.length - 3} {translateMessage('more')}
            </span>
          ) : null}
          {role.permissions.length === 0 ? (
            <span className="text-[11px] text-[var(--text-muted)] italic">{translateMessage('No specific permissions')}</span>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
