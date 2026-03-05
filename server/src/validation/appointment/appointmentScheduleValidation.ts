import { APPOINTMENT_VALIDATION_CONSTANTS } from "./appointmentValidation.constants.js";

export class AppointmentScheduleValidation {
  static validateTimeFormat(time: string): boolean {
    return APPOINTMENT_VALIDATION_CONSTANTS.TIME_FORMAT_REGEX.test(time);
  }

  static validateWorkingHours(time: string): boolean {
    if (!this.validateTimeFormat(time)) {
      throw new Error(
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.INVALID_TIME_FORMAT,
      );
    }

    const [hours] = time.split(":").map(Number);
    const { WORKING_HOURS_START, WORKING_HOURS_END } =
      APPOINTMENT_VALIDATION_CONSTANTS;

    if (hours < WORKING_HOURS_START || hours >= WORKING_HOURS_END) {
      throw new Error(
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.INVALID_WORKING_HOURS(
          WORKING_HOURS_START,
          WORKING_HOURS_END,
        ),
      );
    }

    return true;
  }

  static validateWeekDay(day: string): boolean {
    const { VALID_WEEK_DAYS } = APPOINTMENT_VALIDATION_CONSTANTS;

    if (
      !VALID_WEEK_DAYS.includes(
        day.toLowerCase() as (typeof VALID_WEEK_DAYS)[number],
      )
    ) {
      throw new Error(
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.INVALID_DAY(
          day,
          VALID_WEEK_DAYS,
        ),
      );
    }

    return true;
  }

  static validateScheduleHour(hour: number): boolean {
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
      throw new Error(
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.INVALID_HOUR,
      );
    }

    const { WORKING_HOURS_START, WORKING_HOURS_END } =
      APPOINTMENT_VALIDATION_CONSTANTS;

    if (hour < WORKING_HOURS_START || hour >= WORKING_HOURS_END) {
      throw new Error(
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.INVALID_SCHEDULE_HOUR(
          WORKING_HOURS_START,
          WORKING_HOURS_END,
        ),
      );
    }

    return true;
  }

  static validateWeeklySchedule(
    weeklySchedule: { day: string; hour: number }[],
  ): boolean {
    if (!Array.isArray(weeklySchedule)) {
      throw new Error("Weekly schedule must be an array");
    }

    if (weeklySchedule.length === 0) {
      throw new Error(
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.EMPTY_WEEKLY_SCHEDULE,
      );
    }

    if (
      weeklySchedule.length >
      APPOINTMENT_VALIDATION_CONSTANTS.MAX_WEEKLY_SCHEDULE_ENTRIES
    ) {
      throw new Error(
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES
          .TOO_MANY_SCHEDULE_ENTRIES,
      );
    }

    const uniqueDays = new Set();

    for (const schedule of weeklySchedule) {
      if (
        !schedule.day ||
        typeof schedule.day !== "string" ||
        typeof schedule.hour !== "number"
      ) {
        throw new Error(
          APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES
            .INVALID_SCHEDULE_ENTRY,
        );
      }

      this.validateWeekDay(schedule.day);
      this.validateScheduleHour(schedule.hour);

      const dayLower = schedule.day.toLowerCase();
      if (uniqueDays.has(dayLower)) {
        throw new Error(
          APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.DUPLICATE_DAY(
            schedule.day,
          ),
        );
      }
      uniqueDays.add(dayLower);
    }

    return true;
  }

  static validateMinimumAdvanceTime(date: string, time: string): boolean {
    const appointmentDateTime = new Date(`${date}T${time}:00`);
    const now = new Date();

    if (
      appointmentDateTime.getTime() - now.getTime() <
      APPOINTMENT_VALIDATION_CONSTANTS.MINIMUM_ADVANCE_TIME_MS
    ) {
      throw new Error(
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.MINIMUM_ADVANCE_TIME,
      );
    }

    return true;
  }

  static validateMaximumAdvanceTime(date: string): boolean {
    const appointmentDate = new Date(date);
    const now = new Date();

    if (
      appointmentDate.getTime() - now.getTime() >
      APPOINTMENT_VALIDATION_CONSTANTS.MAXIMUM_ADVANCE_TIME_MS
    ) {
      throw new Error(
        APPOINTMENT_VALIDATION_CONSTANTS.ERROR_MESSAGES.MAXIMUM_ADVANCE_TIME,
      );
    }

    return true;
  }
}
