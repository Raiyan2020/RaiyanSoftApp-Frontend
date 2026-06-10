import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Edit2, Trash2 } from 'lucide-react';
import { Role } from '@/lib/roleStore';
import { translateMessage } from '@/lib/i18n-utils';

interface RoleCardProps {
  role: Role;
  onOpenModal: (role?: Role) => void;
  onDeleteRole: (id: string) => void;
}

export default function RoleCard({ role, onOpenModal, onDeleteRole }: RoleCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
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
            className="p-2 bg-[var(--surface-3)] hover:bg-red-500/20 hover:text-red-400 rounded-lg text-[var(--text-muted)] transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="text-[var(--text)] font-bold text-lg mb-1">{role.name}</h3>
      <p className="text-[var(--text-muted)] text-sm mb-4 h-10 line-clamp-2">{role.description}</p>

      <div className="mt-auto">
        <h4 className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-2">{translateMessage('Permissions')}</h4>
        <div className="flex flex-wrap gap-2">
          {role.permissions.slice(0, 3).map((perm) => (
            <span
              key={perm}
              className="text-[10px] bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text)] px-2 py-1 rounded-md"
            >
              {perm}
            </span>
          ))}
          {role.permissions.length > 3 ? (
            <span className="text-[10px] bg-[var(--surface-3)] border border-[var(--border)] text-[var(--text-muted)] px-2 py-1 rounded-md">
              +{role.permissions.length - 3} {translateMessage('more')}
            </span>
          ) : null}
          {role.permissions.length === 0 ? (
            <span className="text-[10px] text-[var(--text-muted)] italic">{translateMessage('No specific permissions')}</span>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
