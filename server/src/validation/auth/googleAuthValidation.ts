import { check } from "express-validator";

const allowedRoles = ["student", "teacher"] as const;

export const GoogleIdToken = check("idToken")
  .trim()
  .notEmpty()
  .withMessage("idToken is required")
  .isString()
  .withMessage("idToken must be a string");

export const Role = check("role")
  .trim()
  .notEmpty()
  .withMessage("Role is required")
  .isIn(allowedRoles)
  .withMessage("Role must be one of: student, teacher");

export const googleAuthValidationMiddleware = () => [GoogleIdToken, Role];
