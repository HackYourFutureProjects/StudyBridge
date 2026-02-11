import { z } from "zod";

import { recoverySchema } from "./recoveryForm.validation.ts";

export type FormValues = z.infer<typeof recoverySchema>;
