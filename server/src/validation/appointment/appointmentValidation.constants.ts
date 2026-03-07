export const APPOINTMENT_VALIDATION_CONSTANTS = {
  WORKING_HOURS_START: 7,
  WORKING_HOURS_END: 23,

  MINIMUM_ADVANCE_TIME_MS: 15 * 60 * 1000,
  MAXIMUM_ADVANCE_TIME_MS: 90 * 24 * 60 * 60 * 1000,

  MAX_WEEKLY_SCHEDULE_ENTRIES: 7,

  VALID_WEEK_DAYS: [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ] as const,

  TIME_FORMAT_REGEX: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,

  ERROR_MESSAGES: {
    STUDENT_NOT_FOUND: "Student not found",
    TEACHER_NOT_FOUND: "Teacher not found",
    SELF_BOOKING: "Teachers cannot book appointments with themselves",
    PAST_DATE: "Cannot create appointments in the past",
    PAST_TIME: "Cannot create appointments for times that have already passed",
    DUPLICATE_APPOINTMENT:
      "You already have an appointment scheduled for this date and time",
    APPOINTMENT_NOT_FOUND: "Appointment not found",
    UNAUTHORIZED_DELETE: "Unauthorized to delete this appointment",
    UNAUTHORIZED_MODIFY: "Unauthorized to modify this appointment",
    NOT_REGULAR_STUDENT: "Cannot set weekly schedule for a non-regular student",
    INVALID_TIME_FORMAT: "Invalid time format. Use HH:MM format",
    INVALID_WORKING_HOURS: (start: number, end: number) =>
      `Appointments can only be scheduled between ${start}:00 and ${end}:00`,
    INVALID_DAY: (day: string, validDays: readonly string[]) =>
      `Invalid day: ${day}. Valid days are: ${validDays.join(", ")}`,
    INVALID_HOUR: "Hour must be an integer between 0 and 23",
    INVALID_SCHEDULE_HOUR: (start: number, end: number) =>
      `Schedule hour must be between ${start} and ${end - 1}`,
    MINIMUM_ADVANCE_TIME:
      "Appointments must be scheduled at least 1 hour in advance",
    MAXIMUM_ADVANCE_TIME:
      "Appointments cannot be scheduled more than 3 months in advance",
    EMPTY_WEEKLY_SCHEDULE: "Weekly schedule cannot be empty",
    TOO_MANY_SCHEDULE_ENTRIES:
      "Weekly schedule cannot have more than 7 entries",
    DUPLICATE_DAY: (day: string) => `Duplicate day in schedule: ${day}`,
    INVALID_SCHEDULE_ENTRY:
      "Each schedule entry must have a valid day and hour",
  },
} as const;
