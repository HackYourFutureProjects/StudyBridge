import { z } from "zod";

import { resetPasswordSchema } from "./resetPassword.validation.ts";

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
