import { z } from "zod";
import { createChangePasswordSchema } from "./password.validation";

export const changePasswordSchema = createChangePasswordSchema();

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
