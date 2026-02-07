import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().trim().pipe(z.email({ message: "Invalid email" })),
    password: z.string().min(1, { message: 'Password should not be empty' }),
});
