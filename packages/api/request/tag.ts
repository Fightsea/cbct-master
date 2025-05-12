import { z } from 'zod';
import regex from '../utils/regex';

export const createRequestBodySchema = z.object({
  name: z.string().max(30),
  color: z.string().regex(regex.color)
}).strict();

export type CreateRequest = z.infer<typeof createRequestBodySchema>;

export const updateRequestBodySchema = z.object({
  name: z.string().max(30),
  color: z.string().regex(regex.color)
}).strict();

export type UpdateRequest = z.infer<typeof updateRequestBodySchema>;
