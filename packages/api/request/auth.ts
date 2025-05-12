import regex from '../utils/regex';
import { z } from 'zod';

export const loginRequestBodySchema = z.object({
  email: z.string().email().max(50),
  password: z
    .string()
    .regex(regex.password, { message: 'It must be a combination of minimum 8 letters, numbers, and symbols.' })
    .max(30)
}).strict();

export type LoginRequest = z.infer<typeof loginRequestBodySchema>;
