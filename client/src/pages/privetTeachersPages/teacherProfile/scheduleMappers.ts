import type { TimeSlot } from "./TeacherProfile";

export type ApiSlot = { start: string; end: string };

export type ApiAvailability = {
  monday: ApiSlot[];
  tuesday: ApiSlot[];
  wednesday: ApiSlot[];
  thursday: ApiSlot[];
  friday: ApiSlot[];
  saturday: ApiSlot[];
  sunday: ApiSlot[];
};

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const toHHmm = (hour: number) => `${String(hour).padStart(2, "0")}:00`;
const toHHmmEnd = (hour: number) => {
  if (hour >= 24) {
    return "23:59";
  }
  return `${String(hour).padStart(2, "0")}:00`;
};
const fromHHmmToHour = (time: string) => Number(time.split(":")[0]);
const toUiDay = (day: (typeof DAYS)[number]) =>
  day.charAt(0).toUpperCase() + day.slice(1);

export const mergeHoursToSlots = (hours: number[]): ApiSlot[] => {
  if (!hours.length) return [];

  const validHours = hours.filter((h) => h >= 0 && h < 24);
  if (!validHours.length) return [];

  const sorted = [...new Set(validHours)].sort((a, b) => a - b);
  const slots: ApiSlot[] = [];

  let rangeStart = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];

    if (current === prev + 1) {
      prev = current;
      continue;
    }

    slots.push({
      start: toHHmm(rangeStart),
      end: toHHmmEnd(prev + 1),
    });

    rangeStart = current;
    prev = current;
  }

  slots.push({
    start: toHHmm(rangeStart),
    end: toHHmmEnd(prev + 1),
  });

  return slots;
};

export const mapUiSlotsToMergedWeekAvailability = (
  slots: TimeSlot[],
): ApiAvailability => {
  const byDay: Record<(typeof DAYS)[number], number[]> = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };

  for (const slot of slots) {
    const day = slot.day.toLowerCase() as (typeof DAYS)[number];
    if (!DAYS.includes(day)) continue;
    byDay[day].push(slot.hour);
  }

  return {
    monday: mergeHoursToSlots(byDay.monday),
    tuesday: mergeHoursToSlots(byDay.tuesday),
    wednesday: mergeHoursToSlots(byDay.wednesday),
    thursday: mergeHoursToSlots(byDay.thursday),
    friday: mergeHoursToSlots(byDay.friday),
    saturday: mergeHoursToSlots(byDay.saturday),
    sunday: mergeHoursToSlots(byDay.sunday),
  };
};

export const mapWeekAvailabilityToUiSlots = (
  availability: ApiAvailability,
): TimeSlot[] => {
  const slots: TimeSlot[] = [];

  for (const day of DAYS) {
    for (const range of availability[day]) {
      const startHour = fromHHmmToHour(range.start);
      let endHour = fromHHmmToHour(range.end);

      if (range.end === "23:59") {
        endHour = 24;
      }

      for (let hour = startHour; hour < endHour; hour++) {
        slots.push({ day: toUiDay(day), hour });
      }
    }
  }

  return slots;
};
