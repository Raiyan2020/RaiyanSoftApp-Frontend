export type LeadStatusCode = 1 | 2 | 3;

export const LEAD_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
} as const;

export type AdminLeadListUser = {
  id: number;
  full_name: string;
  full_phone: string;
};

export type AdminLeadListItem = {
  id: number;
  request_id?: string;
  user: AdminLeadListUser;
  description: string;
  project_name: string;
  type?: string | { value?: string; key?: string; name?: string } | null;
  status: string;
  date: string;
};

export type AdminLeadDetailUser = {
  id: number;
  name?: string | null;
  full_name?: string | null;
  phone: string;
  email?: string | null;
};

export type AdminLeadAnswer = {
  id: number;
  form_question_id: number;
  question: string;
  form_question_option_id?: number;
  answer: string;
  text_value?: string;
};

export type AdminLeadDetail = {
  id: number;
  user: AdminLeadDetailUser;
  project_name: string;
  color: string;
  status: LeadStatusCode;
  request_id: string;
  description: string;
  answers?: AdminLeadAnswer[];
};

export type AdminLeadsPagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type AdminLeadsFilters = {
  name?: string;
  status?: LeadStatusCode;
  requestId?: string;
  dateFrom?: string;
  dateTo?: string;
  type?: string;
  page?: number;
};

export type LeadStatusAction = 'approve' | 'reject' | 'pending';

export type AdminLeadsListResult = {
  leads: AdminLeadListItem[];
  pagination: AdminLeadsPagination | null;
};
