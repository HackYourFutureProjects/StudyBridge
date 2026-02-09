import { check } from "express-validator";

//check email exists (not empty) and is a valid format
export const passwordResetValidationMiddleware = () => [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Please provide your email")
    .isEmail()
    .withMessage("Invalid email format"),
];
