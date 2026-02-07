import { z } from 'zod';

import { loginSchema } from './loginForm.validation.ts';

export type FormValues = z.infer<typeof loginSchema>;
