import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(5, { message: "Password must be at least 5 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password should not be empty" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
