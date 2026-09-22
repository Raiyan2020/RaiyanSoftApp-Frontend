import React from 'react';
import { NotificationPayload } from '@/lib/marketingNotifications';
import { translateMessage } from '@/lib/i18n-utils';

interface SentNotificationItemProps {
  item: NotificationPayload;
  formatHistoryDate: (ts: number) => string;
}

const capitalize = (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : value);

export default function SentNotificationItem({ item, formatHistoryDate }: SentNotificationItemProps) {
  return (
    <div className="bg-[var(--surface-3)] p-4 rounded-xl border border-[var(--border)] space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-bold text-[var(--text)]">{item.title}</h3>
        <span className="text-[11px] text-[var(--text-muted)]">{formatHistoryDate(item.createdAt)}</span>
      </div>
      <p className="text-xs text-[var(--text-muted)] line-clamp-2">{item.body}</p>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border)]">
        <span className="text-[11px] bg-[var(--surface-3)] text-[var(--text)] px-2 py-0.5 rounded-full capitalize">
          {translateMessage(capitalize(item.target.type))}
        </span>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full ${
            item.status === 'sent'
              ? 'bg-[color-mix(in_srgb,var(--success)_10%,transparent)] text-success'
              : item.status === 'scheduled'
              ? 'bg-[color-mix(in_srgb,var(--info)_10%,transparent)] text-info'
              : 'bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-danger'
          }`}
        >
          {translateMessage(capitalize(item.status))}
        </span>
      </div>
    </div>
  );
}
