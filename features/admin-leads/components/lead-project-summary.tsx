import React from 'react';
import { Lead } from '@/lib/leadStore';

interface LeadProjectSummaryProps {
  projectPayload: Lead['projectPayload'];
}

export default function LeadProjectSummary({ projectPayload }: LeadProjectSummaryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider border-b border-[var(--border)] pb-2">
        Project Details
      </h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-[var(--surface-3)] p-3 rounded-lg">
          <span className="text-[var(--text-muted)] block text-xs mb-1">Industry</span>
          <span className="text-[var(--text)]">
            {projectPayload.industry}{' '}
            {projectPayload.industryOther ? `(${projectPayload.industryOther})` : ''}
          </span>
        </div>
        <div className="bg-[var(--surface-3)] p-3 rounded-lg">
          <span className="text-[var(--text-muted)] block text-xs mb-1">Service Model</span>
          <span className="text-[var(--text)]">{projectPayload.serviceModel}</span>
        </div>
        <div className="bg-[var(--surface-3)] p-3 rounded-lg">
          <span className="text-[var(--text-muted)] block text-xs mb-1">Target Markets</span>
          <span className="text-[var(--text)]">{projectPayload.markets.join(', ')}</span>
        </div>
        <div className="bg-[var(--surface-3)] p-3 rounded-lg">
          <span className="text-[var(--text-muted)] block text-xs mb-1">Platforms</span>
          <span className="text-[var(--text)]">{projectPayload.platforms.join(', ')}</span>
        </div>
      </div>

      <div className="bg-[var(--surface-3)] p-4 rounded-lg">
        <span className="text-[var(--text-muted)] block text-xs mb-2">Description</span>
        <p className="text-[var(--text)] leading-relaxed text-sm">{projectPayload.description}</p>
      </div>
    </div>
  );
}
