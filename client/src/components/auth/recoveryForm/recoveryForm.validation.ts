import { z } from "zod";

export const recoverySchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email({ message: "Invalid email" })),
});
