import { z } from "zod";

import { signUpSchema } from "./signUpForm.validation";

export type FormValues = z.infer<typeof signUpSchema>;
