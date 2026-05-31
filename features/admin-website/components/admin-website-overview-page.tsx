"use client";

import Link from 'next/link';
import { ArrowUpRight, FileText, Globe2, ShieldCheck } from 'lucide-react';
import { websiteContentConfigs } from '../config/website-content-config';

const statCards = [
  { label: 'Managed sections', value: websiteContentConfigs.length, icon: Globe2 },
  { label: 'Publishing workflow', value: 'Draft -> Live', icon: ShieldCheck },
  { label: 'Reusable schema', value: '1 system', icon: FileText },
];

export default function AdminWebsiteOverviewPage() {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-8 shadow-2xl">
        <div className="absolute -top-24 end-10 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Website CMS
          </span>
          <h1 className="mt-5 text-3xl font-black text-white md:text-5xl">Control every public website section from the admin dashboard.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
            Manage services, apps, blog posts, process steps, FAQs, pricing, testimonials, partners, team, careers, legal copy, and global settings without code changes.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
              <Icon className="mb-4 text-primary" size={24} />
              <p className="text-2xl font-black text-white">{card.value}</p>
              <p className="mt-1 text-sm text-slate-400">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {websiteContentConfigs.map((config) => (
          <Link
            key={config.section}
            href={`/admin/website/${config.section}`}
            className="group rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition-all hover:border-primary/40 hover:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-white">{config.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{config.description}</p>
              </div>
              <ArrowUpRight className="shrink-0 text-slate-500 transition group-hover:text-primary" size={20} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wider">
              <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">{config.collection}</span>
              {config.requiresSlug ? <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sky-300">Slug</span> : null}
              {config.requiresApproval ? <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-300">Approval</span> : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
