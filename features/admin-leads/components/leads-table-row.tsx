import React from 'react';
import { Phone, MessageCircle, Eye } from 'lucide-react';
import Avatar from '@/components/ui/avatar';
import { AdminLeadListItem } from '../types/admin-lead.types';
import { getLeadStatusTone } from '../utils/lead-status';

interface LeadsTableRowProps {
  lead: AdminLeadListItem;
  onSelectLead: (lead: AdminLeadListItem) => void;
  toWhatsAppDigits: (phone: string) => string | null;
}

export default function LeadsTableRow({ lead, onSelectLead, toWhatsAppDigits }: LeadsTableRowProps) {
  const waDigits = toWhatsAppDigits(lead.user.full_phone);
  const waMessage =
    'السلام عليكم ورحمة الله وبركاته\nحضرتك قدمت عندنا طلب تطبيق ، طلبك مقبول ان شاء الله ممكن تفاصيل اكثر عن المشروع';
  const encodedWaMessage = encodeURIComponent(waMessage);

  const waUrl = waDigits
    ? `https://web.whatsapp.com/send/?phone=${waDigits}&text=${encodedWaMessage}&type=phone_number&app_absent=0`
    : null;

  const statusTone = getLeadStatusTone(lead.status);

  return (
    <tr className="hover:bg-white/[0.02] transition-colors group">
      <td className="p-5">
        <div className="flex items-center gap-3">
          <Avatar name={lead.user.full_name} size="md" className="w-10 h-10 text-sm" />
          <div>
            <div className="font-bold text-[var(--text)]">{lead.user.full_name}</div>
            <div className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <Phone size={10} /> {lead.user.full_phone}
            </div>
          </div>
        </div>
      </td>
      <td className="p-5">
        <div className="font-medium text-[var(--text)]">{lead.project_name}</div>
        <div className="text-xs text-[var(--text-muted)] truncate max-w-[220px]">{lead.description}</div>
      </td>
      <td className="p-5">
        <span
          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${statusTone.badgeClass}`}
        >
          {lead.status}
        </span>
      </td>
      <td className="p-5 text-[var(--text-muted)] text-xs">{lead.date}</td>
      <td className="p-5 text-right">
        <div className="flex items-center justify-end gap-2">
          <a
            href={waUrl || undefined}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!waUrl) e.preventDefault();
            }}
            className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
              waUrl
                ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                : 'bg-[var(--surface-3)] text-[var(--text-muted)] cursor-not-allowed opacity-50'
            }`}
            title={waUrl ? 'Chat on WhatsApp Web' : 'No Phone'}
          >
            <MessageCircle size={16} />
          </a>

          <button
            type="button"
            onClick={() => onSelectLead(lead)}
            className="p-2 bg-[var(--surface-3)] hover:bg-[var(--surface-3)] text-[var(--text)] hover:text-[var(--text)] rounded-lg transition-colors"
          >
            <Eye size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
