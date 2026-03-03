import { check } from "express-validator";

const allowedStatuses = [
  "draft",
  "pending",
  "active",
  "rejected",
  "blocked",
] as const;
export const Status = check("status")
  .trim()
  .notEmpty()
  .withMessage("Status is required")
  .isIn(allowedStatuses)
  .withMessage(`Status must be one of: ${allowedStatuses.join(", ")}`);

export const statusValidation = () => [Status];
