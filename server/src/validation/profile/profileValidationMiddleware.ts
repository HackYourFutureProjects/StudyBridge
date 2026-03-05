import { check } from "express-validator";
import {
  createPasswordValidator,
  createConfirmPasswordValidator,
  createOldPasswordValidator,
} from "../../utils/validation/password.validation.js";

export const ProfileName = check("firstName")
  .optional()
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage("First name must be between 2 and 50 characters")
  .custom((value) => {
    if (!value) return true;

    for (let i = 0; i < value.length; i++) {
      const char = value[i];
      const isEnglishLetter =
        (char >= "A" && char <= "Z") || (char >= "a" && char <= "z");
      const isSpace = char === " ";

      if (!isEnglishLetter && !isSpace) {
        throw new Error(
          "First name can only contain English letters and spaces",
        );
      }
    }
    return true;
  });

export const ProfileLastName = check("lastName")
  .optional()
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage("Last name must be between 2 and 50 characters")
  .custom((value) => {
    if (!value) return true;

    for (let i = 0; i < value.length; i++) {
      const char = value[i];
      const isEnglishLetter =
        (char >= "A" && char <= "Z") || (char >= "a" && char <= "z");
      const isSpace = char === " ";

      if (!isEnglishLetter && !isSpace) {
        throw new Error(
          "Last name can only contain English letters and spaces",
        );
      }
    }
    return true;
  });

export const ProfilePhone = check("phoneNumber")
  .optional()
  .trim()
  .isLength({ min: 10, max: 15 })
  .withMessage("Phone number must be between 10 and 15 characters")
  .custom((value) => {
    if (!value) return true;

    for (let i = 0; i < value.length; i++) {
      const char = value[i];
      const isNumber = char >= "0" && char <= "9";
      const isAllowedSymbol =
        char === "+" ||
        char === "-" ||
        char === "(" ||
        char === ")" ||
        char === " ";

      if (!isNumber && !isAllowedSymbol) {
        throw new Error(
          "Phone number can only contain numbers, spaces, +, -, (, )",
        );
      }
    }
    return true;
  });

export const ProfileAboutMe = check("bio")
  .optional()
  .trim()
  .isLength({ max: 1000 })
  .withMessage("About me must not be more than 1000 characters");

export const ProfileExperience = check("experience")
  .optional()
  .isInt({ min: 0, max: 50 })
  .withMessage("Experience must be a number between 0 and 50 years");

export const teacherProfileUpdateValidationMiddleware = () => [
  ProfileName,
  ProfileLastName,
  ProfilePhone,
  ProfileAboutMe,
  ProfileExperience,
];

// Reuse shared password validators
export const OldPassword = createOldPasswordValidator();
export const NewPassword = createPasswordValidator("newPassword");
export const ConfirmPassword = createConfirmPasswordValidator(
  "newPassword",
  "confirmPassword",
);

export const changePasswordValidationMiddleware = () => [
  OldPassword,
  NewPassword,
  ConfirmPassword,
];

export const studentProfileUpdateValidationMiddleware = () => [
  ProfileName,
  ProfileLastName,
  ProfilePhone,
];
