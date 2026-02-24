import { body, param } from "express-validator";

export const startCallValidationMiddleware = () => [
  body("teacherId")
    .exists()
    .withMessage("Teacher ID is needed")
    .isString()
    .withMessage("Teacher ID must be a string"),

  body("studentId")
    .exists()
    .withMessage("Student ID is needed")
    .isString()
    .withMessage("Student ID must be a string"),

  body("streamCallId")
    .exists()
    .withMessage("Stream Call ID is needed")
    .isString()
    .withMessage("Stream Call ID must be a string"),

  body("appointmentId").optional({ nullable: true }).isString(),
  body("streamCallType").optional().isString(),
];

//callId param validation for accept/decline/end.
export const callIdValidationMiddleware = () => [
  param("callId")
    .exists()
    .withMessage("Call ID is needed")
    .isString()
    .withMessage("Call ID must be a string"),
];
