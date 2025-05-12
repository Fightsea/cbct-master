import { z } from 'zod';

export const getRecordsRequestQuerySchema = z.object({
  patientId: z.string().uuid()
}).strict();

export type GetRecordsRequest = z.infer<typeof getRecordsRequestQuerySchema>;

export const createRequestBodySchema = z.object({
  patientId: z.string().uuid()
}).strict();

export type CreateRequest = z.infer<typeof createRequestBodySchema>;
