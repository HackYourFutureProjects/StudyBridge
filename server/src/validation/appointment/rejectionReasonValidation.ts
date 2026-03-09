import { check } from "express-validator";

export const rejectionReasonValidation = check("rejectionReason")
  .if(check("status").equals("rejected"))
  .notEmpty()
  .withMessage("Rejection reason is required when rejecting an appointment")
  .isLength({ min: 100, max: 500 })
  .withMessage("Rejection reason must be between 100 and 500 characters")
  .trim();

export const appointmentStatusUpdateValidation = [
  check("status")
    .isIn(["pending", "approved", "rejected"])
    .withMessage("Status must be pending, approved, or rejected"),
  rejectionReasonValidation,
];
