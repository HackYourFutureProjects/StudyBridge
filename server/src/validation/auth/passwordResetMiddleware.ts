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

export const sendPasswordResetValidationMiddleware = () => [
  check("token").trim().notEmpty().withMessage("Reset token is required"),

  check("newPassword")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage("Passwords do not match"),
];
