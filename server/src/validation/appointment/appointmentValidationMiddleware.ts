import { body, param } from "express-validator";
import { MAX_DESCRIPTION_CHARACTERS } from "../../constants/validation.constants.js";

export const createAppointmentValidationMiddleware = () => [
  body("studentId").exists().withMessage("Student ID is needed"),
  body("teacherId").exists().withMessage("Teacher ID is needed"),
  body("lesson").exists().withMessage("Lesson is needed"),
  body("price").exists().withMessage("Price is needed"),
  body("date").exists().withMessage("Date is needed"),
  body("time").exists().withMessage("Time is needed"),
  body("description")
    .optional()
    .custom((value) => {
      if (value) {
        const trimmedDescription = value.trim();
        if (trimmedDescription.length > MAX_DESCRIPTION_CHARACTERS) {
          throw new Error(
            `Description must be no more than ${MAX_DESCRIPTION_CHARACTERS} characters`,
          );
        }
      }
      return true;
    }),
];

export const updateAppointmentStatusValidationMiddleware = () => [
  body("status")
    .exists()
    .withMessage("Status is needed")
    .isIn(["pending", "approved", "rejected"])
    .withMessage("Status must be pending, approved, or rejected"),
  body("rejectionReason")
    .if(body("status").equals("rejected"))
    .notEmpty()
    .withMessage("Rejection reason is required when rejecting an appointment")
    .isLength({ min: 100, max: 500 })
    .withMessage("Rejection reason must be between 100 and 500 characters")
    .trim(),
];

export const idParamValidationMiddleware = () => [
  param("id")
    .exists()
    .withMessage("ID is needed")
    .isString()
    .withMessage("ID must be a string"),
];

export const studentIdParamValidationMiddleware = () => [
  param("studentId")
    .exists()
    .withMessage("Student ID is needed")
    .isString()
    .withMessage("Student ID must be a string"),
];

export const teacherIdParamValidationMiddleware = () => [
  param("teacherId")
    .exists()
    .withMessage("Teacher ID is needed")
    .isString()
    .withMessage("Teacher ID must be a string"),
];
