import { body, param } from "express-validator";

export const dayParamValidationMiddleware = () => [
  param("day")
    .exists()
    .withMessage("Day is needed")
    .isIn([
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ])
    .withMessage("Day must be a valid day of the week"),
];

export const slotsValidationMiddleware = () => [
  body("timezone")
    .optional()
    .isString()
    .withMessage("Timezone must be a string"),

  body("slots").isArray({ min: 1 }).withMessage("Time slots are required"),
  body("slots.*.start")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Each slot start must be in HH:mm format"),
  body("slots.*.end")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Each slot end must be in HH:mm format"),
];

export const slotRangeValidationMiddleware = () => [
  body("slots").custom((slots: { start: string; end: string }[]) => {
    if (!Array.isArray(slots)) return true;
    for (const slot of slots) {
      if (slot.start >= slot.end) {
        throw new Error("Slot start time must be before end time");
      }
    }
    return true;
  }),
];

export const duplicateOrOverlapSlotsValidationMiddleware = () => [
  body("slots")
    .isArray({ min: 1 })
    .withMessage("Time slots are required")
    .bail() // if validator failed, stop running next validators
    .custom((slots: { start: string; end: string }[]) => {
      const unique = new Set<string>();

      for (const slot of slots) {
        const key = `${slot.start}-${slot.end}`;
        if (unique.has(key)) {
          throw new Error("Duplicate slots are not allowed");
        }
        unique.add(key);
      }

      const sorted = [...slots].sort((a, b) => a.start.localeCompare(b.start));

      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const current = sorted[i];

        if (current.start < prev.end) {
          throw new Error("Overlapping slots are not allowed");
        }
      }
      return true;
    }),
];
