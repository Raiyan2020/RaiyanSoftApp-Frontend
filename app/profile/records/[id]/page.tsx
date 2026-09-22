'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, BadgeDollarSign, Calendar, FileText, UserRound } from 'lucide-react';
import { useTranslation } from '@/lib/i18nContext';
import {
  getProfileRecordById,
  getStatusLabel,
  getTypeLabel,
  ProfileRecordStatus,
  ProfileRecordType,
} from '@/components/profile/profile-records-data';

const statusColors: Record<ProfileRecordStatus, string> = {
  active: 'bg-[color-mix(in_srgb,var(--success)_8%,transparent)] text-success border-[color-mix(in_srgb,var(--success)_34%,transparent)]',
  pending: 'bg-[color-mix(in_srgb,var(--warning)_8%,transparent)] text-warning border-[color-mix(in_srgb,var(--warning)_34%,transparent)]',
  completed: 'bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] text-primary border-[color-mix(in_srgb,var(--primary)_34%,transparent)]',
  cancelled: 'bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] text-danger border-[color-mix(in_srgb,var(--danger)_34%,transparent)]',
  draft: 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)]',
};

const typeColors: Record<ProfileRecordType, string> = {
  booking: 'bg-[color-mix(in_srgb,var(--info)_8%,transparent)] text-info border-[color-mix(in_srgb,var(--info)_34%,transparent)]',
  deal: 'bg-[color-mix(in_srgb,var(--success)_8%,transparent)] text-success border-[color-mix(in_srgb,var(--success)_34%,transparent)]',
  project: 'bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] text-primary border-[color-mix(in_srgb,var(--primary)_34%,transparent)]',
  notification: 'bg-[color-mix(in_srgb,var(--warning)_8%,transparent)] text-warning border-[color-mix(in_srgb,var(--warning)_34%,transparent)]',
  info: 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)]',
};

export default function ProfileRecordPage() {
  const params = useParams<{ id: string }>();
  const { dir } = useTranslation();
  const record = getProfileRecordById(params.id);

  if (!record) {
    return (
      <main className="min-h-screen bg-[var(--bg)] px-4 py-10 text-[var(--text)] sm:px-6 lg:px-8" dir={dir}>
        <div className="mx-auto max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-xl">
          <h1 className="text-2xl font-black">{dir === 'rtl' ? 'السجل غير موجود' : 'Record not found'}</h1>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            {dir === 'rtl' ? 'قد يكون هذا السجل غير متاح حالياً.' : 'This record may not be available anymore.'}
          </p>
          <BackLink dir={dir} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-8 text-[var(--text)] sm:px-6 sm:py-10 lg:px-8" dir={dir}>
      <div className="mx-auto max-w-4xl">
        <BackLink dir={dir} />

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl sm:rounded-3xl sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 text-start sm:pb-6">
            <div className="min-w-0 flex-1">
              <p className="mb-2 font-mono text-xs font-bold text-[var(--text-muted)]">{record.id}</p>
              <h1 className="break-words text-2xl font-black tracking-tight text-[var(--text)] sm:text-3xl">{record.title}</h1>
              <p className="mt-3 max-w-2xl break-words text-sm leading-6 text-[var(--text-muted)]">{record.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${typeColors[record.type]}`}>
                {getTypeLabel(record.type, dir)}
              </span>
              <span className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${statusColors[record.status]}`}>
                {getStatusLabel(record.status, dir)}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
            <DetailItem icon={<UserRound size={18} />} label={dir === 'rtl' ? 'المسؤول' : 'Owner'} value={record.owner} />
            <DetailItem icon={<Calendar size={18} />} label={dir === 'rtl' ? 'التاريخ' : 'Date'} value={record.date} />
            <DetailItem
              icon={<BadgeDollarSign size={18} />}
              label={dir === 'rtl' ? 'القيمة' : 'Amount'}
              value={record.amount > 0 ? `$${record.amount.toLocaleString()}` : '-'}
            />
            <DetailItem
              icon={<FileText size={18} />}
              label={dir === 'rtl' ? 'نوع السجل' : 'Record type'}
              value={getTypeLabel(record.type, dir)}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function BackLink({ dir }: { dir: 'ltr' | 'rtl' }) {
  const Icon = dir === 'rtl' ? ArrowRight : ArrowLeft;

  return (
    <Link
      href="/profile"
      className="mb-5 inline-flex max-w-full items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-bold text-[var(--text-muted)] transition-colors hover:text-primary sm:mb-6"
    >
      <Icon size={16} />
      {dir === 'rtl' ? 'العودة إلى الملف الشخصي' : 'Back to profile'}
    </Link>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-start">
      <div className="mb-3 flex items-center gap-2 text-primary">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">{label}</span>
      </div>
      <p className="break-words text-sm font-bold text-[var(--text)]">{value}</p>
    </div>
  );
}
