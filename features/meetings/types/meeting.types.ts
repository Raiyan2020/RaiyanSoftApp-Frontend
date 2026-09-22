export type MeetingStatusCode = 1 | 2 | 3 | 4;

export const MEETING_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
  CANCELED: 4,
} as const;

export type MeetingTypeCode = 1 | 2;

export const MEETING_TYPE = {
  ONLINE: 1,
  OFFLINE: 2,
} as const;

export type MeetingAvailability = {
  available_days: string[];
  available_slots: string[];
};

export type UserMeeting = {
  id: number;
  date_time: string;
  subject: string;
  notes: string | null;
  type: MeetingTypeCode | null;
  status: MeetingStatusCode;
  status_label: string;
  created_at: string;
};

export type BookMeetingPayload = {
  date_time: string;
  subject: string;
  notes?: string;
  type: MeetingTypeCode;
};

export type MeetingsPagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type UserMeetingsFilters = {
  page?: number;
};

export type UserMeetingsListResult = {
  meetings: UserMeeting[];
  pagination: MeetingsPagination | null;
};

export type AdminMeeting = {
  id: number;
  date_time: string;
  subject: string;
  notes: string | null;
  type: MeetingTypeCode | null;
  type_label?: string | null;
  status: MeetingStatusCode;
  status_label: string;
  cancel_by?: number | null;
  cancel_by_name?: string | null;
  created_at: string;
  user?: {
    full_name: string;
    full_phone: string;
  } | null;
};

export type AdminMeetingsFilters = {
  name?: string;
  email?: string;
  phone?: string;
  status?: MeetingStatusCode;
  type?: MeetingTypeCode;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
};

export type AdminMeetingsListResult = {
  meetings: AdminMeeting[];
  pagination: MeetingsPagination | null;
};

export type TimeSlotRange = {
  start_time: string;
  end_time: string;
};

export type TimeSlotDayConfig = {
  is_active: boolean;
  time_slots: TimeSlotRange[];
};

export type TimeSlotsConfig = {
  days: Record<string, TimeSlotDayConfig>;
};

export type TimeSlotDayApiItem = {
  id: number;
  name: string;
  is_active: boolean;
  time_slots: TimeSlotRange[];
};

export type MeetingSettingsPayload = {
  duration_minutes: number;
  buffer_after_minutes: number;
  min_notice_hours: number;
  booking_window_days: number;
  daily_meeting_limit: number;
};

export type MeetingSettingsForm = {
  durationMin: number;
  bufferMin: number;
  minNoticeHours: number;
  maxWindowDays: number;
  dailyLimit: number;
};

export type WeeklyAvailabilityDay = {
  enabled: boolean;
  ranges: TimeSlotRange[];
  /**
   * The real `days` table primary key for this weekday, as returned by GET.
   * The backend looks slots up by this raw id (Day::find($dayId)), and the
   * seeded row order doesn't match the Sun-first UI index, so saves must
   * carry the id the API gave us rather than recomputing one from the index.
   */
  dayId?: number;
};

export type WeeklyAvailability = Record<number, WeeklyAvailabilityDay>;
