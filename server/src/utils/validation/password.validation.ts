import { check } from "express-validator";

/**
 * Shared password validation logic
 */
export const validatePasswordStrength = (value: string): boolean => {
  // Check for uppercase letter
  let hasUppercase = false;
  for (let i = 0; i < value.length; i++) {
    if (value[i] >= "A" && value[i] <= "Z") {
      hasUppercase = true;
      break;
    }
  }
  if (!hasUppercase) {
    throw new Error("Password must contain at least one uppercase letter");
  }

  // Check for lowercase letter
  let hasLowercase = false;
  for (let i = 0; i < value.length; i++) {
    if (value[i] >= "a" && value[i] <= "z") {
      hasLowercase = true;
      break;
    }
  }
  if (!hasLowercase) {
    throw new Error("Password must contain at least one lowercase letter");
  }

  // Check for number
  let hasNumber = false;
  for (let i = 0; i < value.length; i++) {
    if (value[i] >= "0" && value[i] <= "9") {
      hasNumber = true;
      break;
    }
  }
  if (!hasNumber) {
    throw new Error("Password must contain at least one number");
  }

  // Check for special character
  const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  let hasSpecial = false;
  for (let i = 0; i < value.length; i++) {
    for (let j = 0; j < specialChars.length; j++) {
      if (value[i] === specialChars[j]) {
        hasSpecial = true;
        break;
      }
    }
    if (hasSpecial) break;
  }
  if (!hasSpecial) {
    throw new Error(
      "Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)",
    );
  }

  return true;
};

/**
 * Reusable password validation middleware
 */
export const createPasswordValidator = (fieldName: string = "newPassword") =>
  check(fieldName)
    .isLength({ min: 8, max: 50 })
    .withMessage("Password must be between 8 and 50 characters")
    .custom(validatePasswordStrength);

/**
 * Reusable confirm password validation middleware
 */
export const createConfirmPasswordValidator = (
  passwordField: string = "newPassword",
  confirmField: string = "confirmPassword",
) =>
  check(confirmField)
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body[passwordField]) {
        throw new Error("Passwords do not match");
      }
      return true;
    });

/**
 * Old password validation
 */
export const createOldPasswordValidator = () =>
  check("oldPassword").notEmpty().withMessage("Current password is required");
