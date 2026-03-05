import { z } from "zod";

export const createPasswordValidation = () =>
  z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(50, { message: "Password must not be more than 50 characters" })
    .refine(
      (val) => {
        let hasUppercase = false;
        for (let i = 0; i < val.length; i++) {
          if (val[i] >= "A" && val[i] <= "Z") {
            hasUppercase = true;
            break;
          }
        }
        return hasUppercase;
      },
      {
        message: "Password must contain at least one uppercase letter",
      },
    )
    .refine(
      (val) => {
        let hasLowercase = false;
        for (let i = 0; i < val.length; i++) {
          if (val[i] >= "a" && val[i] <= "z") {
            hasLowercase = true;
            break;
          }
        }
        return hasLowercase;
      },
      {
        message: "Password must contain at least one lowercase letter",
      },
    )
    .refine(
      (val) => {
        let hasNumber = false;
        for (let i = 0; i < val.length; i++) {
          if (val[i] >= "0" && val[i] <= "9") {
            hasNumber = true;
            break;
          }
        }
        return hasNumber;
      },
      {
        message: "Password must contain at least one number",
      },
    )
    .refine(
      (val) => {
        const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
        let hasSpecial = false;
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < specialChars.length; j++) {
            if (val[i] === specialChars[j]) {
              hasSpecial = true;
              break;
            }
          }
          if (hasSpecial) break;
        }
        return hasSpecial;
      },
      {
        message:
          "Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)",
      },
    );

export const createChangePasswordSchema = () =>
  z
    .object({
      oldPassword: z
        .string()
        .min(1, { message: "Current password should not be empty" }),
      newPassword: createPasswordValidation(),
      confirmPassword: z
        .string()
        .min(1, { message: "Confirm password should not be empty" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

export type ChangePasswordFormData = z.infer<
  ReturnType<typeof createChangePasswordSchema>
>;
