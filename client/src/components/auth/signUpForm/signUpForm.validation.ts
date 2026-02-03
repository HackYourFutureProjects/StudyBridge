import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(15, { message: "First name must not be more than 15 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(15, { message: "Last name must not be more than 15 characters" }),
  email: z
    .string()
    .trim()
    .pipe(z.email({ message: "Invalid email" })),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters" }),
});
