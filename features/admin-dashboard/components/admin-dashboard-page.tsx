'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, FolderKanban, Inbox, RefreshCw, Users } from 'lucide-react';
import { apiService } from '@/lib/api-service';
import { translateMessage } from '@/lib/i18n-utils';
import { useTranslation } from '@/lib/i18nContext';
import { formatLocalizedDate } from '@/lib/language';
import { fetchAdminLeads } from '@/features/admin-leads/services/admin-leads-api';
import { LEAD_STATUS, AdminLeadListItem } from '@/features/admin-leads/types/admin-lead.types';
import { fetchAdminMeetings } from '@/features/admin-meetings/services/admin-meetings-api';
import { MEETING_STATUS, AdminMeeting } from '@/features/meetings';

type DashboardStats = {
  users: number;
  projects: number;
  leads: number;
  meetings: number;
  leadsPending: number;
  leadsApproved: number;
  leadsRejected: number;
  meetingsPending: number;
};

const initialStats: DashboardStats = {
  users: 0,
  projects: 0,
  leads: 0,
  meetings: 0,
  leadsPending: 0,
  leadsApproved: 0,
  leadsRejected: 0,
  meetingsPending: 0,
};

async function countEndpoint(path: string) {
  const response = await apiService.get<unknown>(path, { skipGlobalToast: true });
  if (!response.status) throw new Error(response.message || 'Unable to load dashboard data.');
  const paginated = response as typeof response & { pagination?: { total?: number } };
  if (typeof paginated.pagination?.total === 'number') return paginated.pagination.total;
  return Array.isArray(response.data) ? response.data.length : 0;
}

export default function AdminDashboardPage() {
  const { language } = useTranslation();
  const [stats, setStats] = useState(initialStats);
  const [recentLeads, setRecentLeads] = useState<AdminLeadListItem[]>([]);
  const [recentMeetings, setRecentMeetings] = useState<AdminMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const [
      users,
      projects,
      leadsAll,
      leadsPending,
      leadsRejected,
      meetingsAll,
      meetingsPending,
    ] = await Promise.allSettled([
      countEndpoint('admin/users'),
      // `admin/projects` returns exactly the projects whose status is
      // APPROVED (AdminProjectService::getProjects hard-filters on it) — a
      // "request" becomes a "project" the moment it's approved. So this same
      // count doubles as "approved requests": `admin/leads` itself can never
      // report that number, because AdminLeadService::getLeads excludes
      // APPROVED rows before applying the status filter (leads?status=2
      // always resolves to 0 — verified live against the backend).
      countEndpoint('admin/projects'),
      fetchAdminLeads({ page: 1 }, language),
      countEndpoint(`admin/leads?status=${LEAD_STATUS.PENDING}`),
      countEndpoint(`admin/leads?status=${LEAD_STATUS.REJECTED}`),
      fetchAdminMeetings({ page: 1 }),
      countEndpoint(`admin/meetings?status=${MEETING_STATUS.PENDING}`),
    ]);

    const approved = projects.status === 'fulfilled' ? projects.value : 0;
    const pending = leadsPending.status === 'fulfilled' ? leadsPending.value : 0;
    const rejected = leadsRejected.status === 'fulfilled' ? leadsRejected.value : 0;

    setStats({
      users: users.status === 'fulfilled' ? users.value : 0,
      projects: approved,
      // `admin/leads` only ever lists non-approved requests, so its own
      // pagination total undercounts "all requests ever submitted". Sum the
      // three statuses instead so the tile reflects the true total.
      leads: pending + approved + rejected,
      meetings: meetingsAll.status === 'fulfilled' ? meetingsAll.value.pagination?.total ?? meetingsAll.value.meetings.length : 0,
      leadsPending: pending,
      leadsApproved: approved,
      leadsRejected: rejected,
      meetingsPending: meetingsPending.status === 'fulfilled' ? meetingsPending.value : 0,
    });
    setRecentLeads(leadsAll.status === 'fulfilled' ? leadsAll.value.leads.slice(0, 5) : []);
    setRecentMeetings(meetingsAll.status === 'fulfilled' ? meetingsAll.value.meetings.slice(0, 5) : []);

    const results = [users, projects, leadsAll, leadsPending, leadsRejected, meetingsAll, meetingsPending];
    if (results.some((result) => result.status === 'rejected')) {
      setError(translateMessage('Some dashboard statistics could not be loaded.'));
    }
    setLoading(false);
  }, [language]);

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

  const leadStatusBreakdown = [
    { key: LEAD_STATUS.PENDING, label: 'Pending', value: stats.leadsPending },
    { key: LEAD_STATUS.APPROVED, label: 'Approved', value: stats.leadsApproved },
    { key: LEAD_STATUS.REJECTED, label: 'Rejected', value: stats.leadsRejected },
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

      {error ? <p className="rounded-xl border border-[color-mix(in_srgb,var(--warning)_30%,transparent)] bg-[color-mix(in_srgb,var(--warning)_8%,transparent)] px-4 py-3 text-sm text-warning">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link key={label} href={href} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-lg transition hover:-translate-y-0.5 hover:border-primary/40">
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-bold text-[var(--text-muted)]">{translateMessage(label)}</span>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon size={18} /></span>
            </div>
            <p className="mt-3 text-3xl font-black text-[var(--text)]">{loading ? '-' : value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-[var(--text)]">{translateMessage('Requests by status')}</h2>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {leadStatusBreakdown.map(({ key, label, value }) => (
              <div key={key} className="rounded-xl border border-[var(--border)] px-3 py-4 text-center">
                <p className="text-2xl font-black text-[var(--text)]">{loading ? '-' : value}</p>
                <p className="mt-1 text-xs font-bold text-[var(--text-muted)]">{translateMessage(label)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-[var(--text)]">{translateMessage('Meetings')}</h2>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[var(--border)] px-3 py-4 text-center">
              <p className="text-2xl font-black text-[var(--text)]">{loading ? '-' : stats.meetingsPending}</p>
              <p className="mt-1 text-xs font-bold text-[var(--text-muted)]">{translateMessage('Awaiting approval')}</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] px-3 py-4 text-center">
              <p className="text-2xl font-black text-[var(--text)]">{loading ? '-' : stats.meetings}</p>
              <p className="mt-1 text-xs font-bold text-[var(--text-muted)]">{translateMessage('Total')}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-[var(--text)]">{translateMessage('Recent requests')}</h2>
            <Link href="/admin/leads" className="text-sm font-bold text-primary">{translateMessage('View all')}</Link>
          </div>
          <div className="mt-4 space-y-3">
            {!loading && recentLeads.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">{translateMessage('No requests yet.')}</p>
            ) : null}
            {recentLeads.map((lead) => (
              <Link
                key={lead.id}
                href="/admin/leads"
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] px-4 py-3 transition hover:border-primary/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[var(--text)]">{lead.project_name || lead.user.full_name}</p>
                  <p className="truncate text-xs text-[var(--text-muted)]">{lead.user.full_name} · {formatLocalizedDate(lead.date, language)}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{lead.status}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-[var(--text)]">{translateMessage('Recent meetings')}</h2>
            <Link href="/admin/appointments" className="text-sm font-bold text-primary">{translateMessage('View all')}</Link>
          </div>
          <div className="mt-4 space-y-3">
            {!loading && recentMeetings.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">{translateMessage('No meetings yet.')}</p>
            ) : null}
            {recentMeetings.map((meeting) => (
              <Link
                key={meeting.id}
                href="/admin/appointments"
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] px-4 py-3 transition hover:border-primary/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[var(--text)]">{meeting.subject || meeting.user?.full_name}</p>
                  <p className="truncate text-xs text-[var(--text-muted)]">{meeting.user?.full_name} · {formatLocalizedDate(meeting.date_time, language, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{meeting.status_label}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
        <h2 className="text-lg font-black text-[var(--text)]">{translateMessage('Quick actions')}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary" href="/admin/leads">{translateMessage('Review requests')}</Link>
          <Link className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-bold text-[var(--text)]" href="/admin/appointments">{translateMessage('Manage meetings')}</Link>
          <Link className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-bold text-[var(--text)]" href="/admin/landing-page">{translateMessage('Edit website')}</Link>
        </div>
      </section>
    </div>
  );
}
