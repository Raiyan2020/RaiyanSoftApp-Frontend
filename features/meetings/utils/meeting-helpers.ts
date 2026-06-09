import { MEETING_STATUS, MEETING_TYPE, MeetingTypeCode, TimeSlotDayApiItem } from '../types/meeting.types';

export function formatDateKey(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function buildDateTimeValue(date: Date, time: string): string {
  const dateKey = formatDateKey(date);
  const normalizedTime = time.slice(0, 8);
  const timeParts = normalizedTime.split(':');
  const hh = (timeParts[0] || '00').padStart(2, '0');
  const mm = (timeParts[1] || '00').padStart(2, '0');
  const ss = (timeParts[2] || '00').padStart(2, '0');
  return `${dateKey} ${hh}:${mm}:${ss}`;
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

function dayNameToUiIndex(name: string) {
  const normalized = name.trim().toLowerCase();
  const map: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  return map[normalized] ?? null;
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

export function timeSlotsToWeeklyAvailability(
  days: Record<string, { is_active: boolean; time_slots: { start_time: string; end_time: string }[] }> | TimeSlotDayApiItem[]
) {
  const weekly = defaultWeeklyAvailability();

  if (Array.isArray(days)) {
    days.forEach((day) => {
      const uiIndex = dayNameToUiIndex(day.name);
      if (uiIndex === null) return;

      weekly[uiIndex] = {
        enabled: day.is_active,
        ranges: day.time_slots || [],
      };
    });
    return weekly;
  }

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

function normalizeTimeValue(value: string) {
  return value.trim().slice(0, 5);
}

function isValidTimeValue(value: string) {
  return /^\d{2}:\d{2}$/.test(value);
}

function isTimeAfter(a: string, b: string) {
  return a > b;
}

function normalizeRange(range: { start_time: string; end_time: string }) {
  const start_time = normalizeTimeValue(range.start_time);
  const end_time = normalizeTimeValue(range.end_time);

  if (!isValidTimeValue(start_time) || !isValidTimeValue(end_time)) {
    return null;
  }

  if (start_time === end_time) {
    return null;
  }

  if (isTimeAfter(start_time, end_time)) {
    return { start_time: end_time, end_time: start_time };
  }

  return { start_time, end_time };
}

export function normalizeWeeklyAvailabilityPayload(
  weekly: Record<number, { enabled: boolean; ranges: { start_time: string; end_time: string }[] }>
) {
  const days: Record<string, { is_active: boolean; time_slots: { start_time: string; end_time: string }[] }> = {};

  for (let uiIndex = 0; uiIndex <= 6; uiIndex += 1) {
    const config = weekly[uiIndex] || { enabled: false, ranges: [] };
    const apiDay = String(uiIndexToApiDay(uiIndex));
    const time_slots = (config.ranges || [])
      .map(normalizeRange)
      .filter((range): range is { start_time: string; end_time: string } => Boolean(range));
    const fallbackSlots = [{ start_time: '09:00', end_time: '17:00' }];

    days[apiDay] = {
      is_active: config.enabled,
      time_slots: time_slots.length > 0 ? time_slots : fallbackSlots,
    };
  }

  return { days };
}
