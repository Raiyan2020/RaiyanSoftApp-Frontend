import { MEETING_STATUS, MEETING_TYPE, MeetingTypeCode } from '../types/meeting.types';

export function formatDateKey(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function buildDateTimeValue(date: Date, time: string): string {
  const dateKey = formatDateKey(date);
  const normalizedTime = time.slice(0, 5);
  return `${dateKey} ${normalizedTime}`;
}

export function meetingTypeFromUi(value: 'online' | 'in_person'): MeetingTypeCode {
  return value === 'online' ? MEETING_TYPE.ONLINE : MEETING_TYPE.OFFLINE;
}

export function parseMeetingDateTime(dateTime: string) {
  const normalized = dateTime.replace(' ', 'T');
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export function isActiveMeetingStatus(status: number) {
  return status === MEETING_STATUS.PENDING || status === MEETING_STATUS.APPROVED;
}

export function canCancelMeeting(status: number) {
  return status === MEETING_STATUS.PENDING || status === MEETING_STATUS.APPROVED;
}

export function getMeetingStatusTone(status: number | string) {
  const code = typeof status === 'number' ? status : Number(status);

  if (code === MEETING_STATUS.APPROVED) {
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  }
  if (code === MEETING_STATUS.REJECTED) {
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  }
  if (code === MEETING_STATUS.CANCELED) {
    return 'bg-slate-500/10 text-[var(--text-muted)] border-slate-500/20';
  }
  return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
}

/** API day 1=Mon … 7=Sun → UI index 0=Sun … 6=Sat */
export function apiDayToUiIndex(apiDay: number) {
  return apiDay === 7 ? 0 : apiDay;
}

export function uiIndexToApiDay(uiIndex: number) {
  return uiIndex === 0 ? 7 : uiIndex;
}

export function defaultWeeklyAvailability(): Record<number, { enabled: boolean; ranges: { start_time: string; end_time: string }[] }> {
  return {
    0: { enabled: false, ranges: [] },
    1: { enabled: true, ranges: [{ start_time: '09:00', end_time: '17:00' }] },
    2: { enabled: true, ranges: [{ start_time: '09:00', end_time: '17:00' }] },
    3: { enabled: true, ranges: [{ start_time: '09:00', end_time: '17:00' }] },
    4: { enabled: true, ranges: [{ start_time: '09:00', end_time: '17:00' }] },
    5: { enabled: true, ranges: [{ start_time: '09:00', end_time: '17:00' }] },
    6: { enabled: false, ranges: [] },
  };
}

export function timeSlotsToWeeklyAvailability(days: Record<string, { is_active: boolean; time_slots: { start_time: string; end_time: string }[] }>) {
  const weekly = defaultWeeklyAvailability();

  Object.entries(days).forEach(([apiDay, config]) => {
    const uiIndex = apiDayToUiIndex(Number(apiDay));
    weekly[uiIndex] = {
      enabled: config.is_active,
      ranges: config.time_slots || [],
    };
  });

  return weekly;
}

export function weeklyAvailabilityToTimeSlots(weekly: Record<number, { enabled: boolean; ranges: { start_time: string; end_time: string }[] }>) {
  const days: Record<string, { is_active: boolean; time_slots: { start_time: string; end_time: string }[] }> = {};

  Object.entries(weekly).forEach(([uiIndex, config]) => {
    const apiDay = String(uiIndexToApiDay(Number(uiIndex)));
    days[apiDay] = {
      is_active: config.enabled,
      time_slots: config.ranges || [],
    };
  });

  return { days };
}

export function defaultMeetingSettingsForm() {
  return {
    durationMin: 60,
    bufferMin: 0,
    minNoticeHours: 2,
    maxWindowDays: 15,
    dailyLimit: 5,
  };
}
