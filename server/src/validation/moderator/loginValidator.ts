import { check } from "express-validator";

export const EmailLogin = check("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Invalid email format");

export const PasswordLogin = check("password")
  .notEmpty()
  .withMessage("Password is required");

export const authLoginModeratorValidationMiddleware = () => [
  EmailLogin,
  PasswordLogin,
];
