import { body } from "express-validator";

export const teacherVisibilityValidationMiddleware = () => [
  body("isPublic")
    .exists()
    .withMessage("isPublic is required")
    .isBoolean()
    .withMessage("isPublic must be boolean"),
];
