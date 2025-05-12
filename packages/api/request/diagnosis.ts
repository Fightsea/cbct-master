import { z } from 'zod';
import regex from '../utils/regex';

export const createRequestBodySchema = z.object({
  datetime: z.string().regex(regex.datetime),
  note: z.string(),
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  tagIds: z.array(z.string().uuid()).min(0)
}).strict();

export type CreateRequest = z.infer<typeof createRequestBodySchema>;
