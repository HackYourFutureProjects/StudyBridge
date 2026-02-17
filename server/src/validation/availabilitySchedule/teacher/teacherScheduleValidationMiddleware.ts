import { body } from "express-validator";

const SLOT_TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const WEEK_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const validateSlotsArray = (slots: { start: string; end: string }[]) => {
  const unique = new Set<string>();

  for (const slot of slots) {
    if (slot.start >= slot.end) {
      throw new Error("Slot start time must be before end time");
    }

    const key = `${slot.start}-${slot.end}`;
    if (unique.has(key)) {
      throw new Error("Duplicate slots are not allowed");
    }
    unique.add(key);
  }

  const sorted = [...slots].sort((a, b) => a.start.localeCompare(b.start));
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].start < sorted[i - 1].end) {
      throw new Error("Overlapping slots are not allowed");
    }
  }
};

export const validateWeekAvailabilityPayload = () => [
  body("timezone")
    .optional()
    .isString()
    .withMessage("Timezone must be a string"),
  body("availability").isObject().withMessage("Availability must be an object"),
  ...WEEK_DAYS.flatMap((day) => [
    body(`availability.${day}`)
      .isArray()
      .withMessage(`${day} slots must be an array`),
    body(`availability.${day}.*.start`)
      .matches(SLOT_TIME_REGEX)
      .withMessage(`Each ${day} slot start must be in HH:mm format`),
    body(`availability.${day}.*.end`)
      .matches(SLOT_TIME_REGEX)
      .withMessage(`Each ${day} slot end must be in HH:mm format`),
  ]),
];

export const validateWeekSlotRules = () => [
  body("availability").custom(
    (availability: Record<string, { start: string; end: string }[]>) => {
      for (const day of WEEK_DAYS) {
        const slots = availability?.[day];
        if (!Array.isArray(slots)) {
          throw new Error(`${day} slots must be an array`);
        }
        validateSlotsArray(slots);
      }
      return true;
    },
  ),
];
