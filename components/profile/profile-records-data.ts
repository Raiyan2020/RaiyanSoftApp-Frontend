export type ProfileRecordType = 'booking' | 'deal' | 'project' | 'notification' | 'info';
export type ProfileRecordStatus = 'active' | 'pending' | 'completed' | 'cancelled' | 'draft';

export interface ProfileRecord {
  id: string;
  title: string;
  type: ProfileRecordType;
  owner: string;
  date: string;
  amount: number;
  status: ProfileRecordStatus;
  description: string;
}

export const profileRecordTypes: ProfileRecordType[] = ['booking', 'deal', 'project', 'notification', 'info'];

export const profileRecords: ProfileRecord[] = [
  {
    id: 'REC-1001',
    title: 'Discovery call for delivery app',
    type: 'booking',
    owner: 'Abdullah Mohammed',
    date: '2026-06-08',
    amount: 0,
    status: 'pending',
    description: 'Initial consultation to review requirements, timeline, and product scope.',
  },
  {
    id: 'REC-1002',
    title: 'Starter website package',
    type: 'deal',
    owner: 'Sarah Ali',
    date: '2026-06-04',
    amount: 450,
    status: 'active',
    description: 'Limited offer for a responsive website with content setup and launch support.',
  },
  {
    id: 'REC-1003',
    title: 'Restaurant ordering platform',
    type: 'project',
    owner: 'Noura Foods',
    date: '2026-05-28',
    amount: 3200,
    status: 'completed',
    description: 'Customer ordering web app with menu management and order notifications.',
  },
  {
    id: 'REC-1004',
    title: 'Company profile update',
    type: 'info',
    owner: 'Raiyansoft Team',
    date: '2026-06-01',
    amount: 0,
    status: 'draft',
    description: 'Profile and account information update request for the customer workspace.',
  },
  {
    id: 'REC-1013',
    title: 'Your consultation is waiting for confirmation',
    type: 'notification',
    owner: 'Booking Desk',
    date: '2026-06-15',
    amount: 0,
    status: 'pending',
    description: 'Please confirm your preferred consultation time so our team can prepare the meeting agenda.',
  },
  {
    id: 'REC-1014',
    title: 'New deal added to your profile',
    type: 'notification',
    owner: 'Sales Team',
    date: '2026-06-13',
    amount: 0,
    status: 'active',
    description: 'A new starter package deal is available in your profile. Review it before the offer expires.',
  },
  {
    id: 'REC-1005',
    title: 'E-commerce growth consultation',
    type: 'booking',
    owner: 'Misk Store',
    date: '2026-06-11',
    amount: 0,
    status: 'active',
    description: 'Strategy session for checkout, payments, delivery, and conversion improvements.',
  },
  {
    id: 'REC-1006',
    title: 'Mobile app MVP deal',
    type: 'deal',
    owner: 'Fahad Saleh',
    date: '2026-06-12',
    amount: 1800,
    status: 'pending',
    description: 'MVP package for a simple mobile app with design, build, and deployment guidance.',
  },
  {
    id: 'REC-1007',
    title: 'Real estate listing app',
    type: 'project',
    owner: 'Dar Properties',
    date: '2026-05-18',
    amount: 5400,
    status: 'active',
    description: 'Property listings, inquiry capture, saved searches, and admin publishing tools.',
  },
  {
    id: 'REC-1008',
    title: 'Billing information review',
    type: 'info',
    owner: 'Finance Desk',
    date: '2026-05-25',
    amount: 0,
    status: 'completed',
    description: 'Customer billing profile and invoice metadata review.',
  },
  {
    id: 'REC-1009',
    title: 'Support handoff meeting',
    type: 'booking',
    owner: 'Rayan Support',
    date: '2026-06-14',
    amount: 0,
    status: 'pending',
    description: 'Meeting to transfer project notes, credentials, and post-launch support tasks.',
  },
  {
    id: 'REC-1010',
    title: 'Admin dashboard enhancement',
    type: 'project',
    owner: 'Operations Team',
    date: '2026-05-21',
    amount: 2100,
    status: 'cancelled',
    description: 'Internal reporting dashboard improvements and workflow automation.',
  },
  {
    id: 'REC-1011',
    title: 'Brand refresh bundle',
    type: 'deal',
    owner: 'Lama Studio',
    date: '2026-06-03',
    amount: 900,
    status: 'active',
    description: 'Logo cleanup, colors, typography, and social profile kit.',
  },
  {
    id: 'REC-1012',
    title: 'Account security note',
    type: 'info',
    owner: 'Security Team',
    date: '2026-06-06',
    amount: 0,
    status: 'active',
    description: 'Reminder to confirm phone access and keep recovery information current.',
  },
];

export function getProfileRecordById(id: string) {
  return profileRecords.find((record) => record.id === id);
}

export function getTypeLabel(type: ProfileRecordType, dir: 'ltr' | 'rtl') {
  const labels: Record<ProfileRecordType, { en: string; ar: string }> = {
    booking: { en: 'Booking', ar: 'الحجوزات' },
    deal: { en: 'Deal', ar: 'العروض' },
    project: { en: 'Project', ar: 'المشاريع' },
    notification: { en: 'Notification', ar: 'الإشعارات' },
    info: { en: 'More Info', ar: 'معلومات أكثر' },
  };

  return dir === 'rtl' ? labels[type].ar : labels[type].en;
}

export function getStatusLabel(status: ProfileRecordStatus, dir: 'ltr' | 'rtl') {
  const labels: Record<ProfileRecordStatus, { en: string; ar: string }> = {
    active: { en: 'Active', ar: 'نشط' },
    pending: { en: 'Pending', ar: 'قيد الانتظار' },
    completed: { en: 'Completed', ar: 'مكتمل' },
    cancelled: { en: 'Cancelled', ar: 'ملغي' },
    draft: { en: 'Draft', ar: 'مسودة' },
  };

  return dir === 'rtl' ? labels[status].ar : labels[status].en;
}
