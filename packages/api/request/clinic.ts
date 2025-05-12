import { z } from 'zod';

export const createRequestBodySchema = z.object({
  name: z.string().min(1).max(30),
  taxId: z.string().min(1).max(30),
  phone: z.string().min(1).max(20),
  address: z.string()
}).strict();

export type CreateRequest = z.infer<typeof createRequestBodySchema>;
