'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, FolderKanban, Inbox, RefreshCw, Users } from 'lucide-react';
import { apiService } from '@/lib/api-service';
import { translateMessage } from '@/lib/i18n-utils';

type DashboardStats = { users: number; projects: number; leads: number; meetings: number };

const initialStats: DashboardStats = { users: 0, projects: 0, leads: 0, meetings: 0 };

async function countEndpoint(path: string) {
  const response = await apiService.get<unknown>(path, { skipGlobalToast: true });
  if (!response.status) throw new Error(response.message || 'Unable to load dashboard data.');
  const paginated = response as typeof response & { pagination?: { total?: number } };
  if (typeof paginated.pagination?.total === 'number') return paginated.pagination.total;
  return Array.isArray(response.data) ? response.data.length : 0;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const [users, projects, leads, meetings] = await Promise.allSettled([
      countEndpoint('admin/users'),
      countEndpoint('admin/projects'),
      countEndpoint('admin/leads'),
      countEndpoint('admin/meetings'),
    ]);
    setStats({
      users: users.status === 'fulfilled' ? users.value : 0,
      projects: projects.status === 'fulfilled' ? projects.value : 0,
      leads: leads.status === 'fulfilled' ? leads.value : 0,
      meetings: meetings.status === 'fulfilled' ? meetings.value : 0,
    });
    if ([users, projects, leads, meetings].some((result) => result.status === 'rejected')) {
      setError(translateMessage('Some dashboard statistics could not be loaded.'));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Data-fetch lifecycle synchronization; the request owns loading/error state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const cards = [
    { label: 'Users', value: stats.users, href: '/admin/users', icon: Users },
    { label: 'Client Projects', value: stats.projects, href: '/admin/user-projects', icon: FolderKanban },
    { label: 'Requests', value: stats.leads, href: '/admin/leads', icon: Inbox },
    { label: 'Meetings', value: stats.meetings, href: '/admin/appointments', icon: CalendarDays },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-primary">{translateMessage('Admin Dashboard')}</p>
          <h1 className="mt-2 text-3xl font-black text-[var(--text)]">{translateMessage('Overview')}</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{translateMessage('Monitor requests, projects, users, and meetings from one place.')}</p>
        </div>
        <button type="button" onClick={load} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-bold text-[var(--text)] disabled:opacity-50">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          {translateMessage('Refresh')}
        </button>
      </div>

      {error ? <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link key={label} href={href} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-lg transition hover:-translate-y-0.5 hover:border-primary/40">
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-bold text-[var(--text-muted)]">{translateMessage(label)}</span>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon size={18} /></span>
            </div>
            <p className="mt-6 text-3xl font-black text-[var(--text)]">{loading ? '—' : value}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
        <h2 className="text-lg font-black text-[var(--text)]">{translateMessage('Quick actions')}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white" href="/admin/leads">{translateMessage('Review requests')}</Link>
          <Link className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-bold text-[var(--text)]" href="/admin/appointments">{translateMessage('Manage meetings')}</Link>
          <Link className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-bold text-[var(--text)]" href="/admin/landing-page">{translateMessage('Edit website')}</Link>
        </div>
      </section>
    </div>
  );
}
