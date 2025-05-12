import { z } from 'zod';

type OrderList = [string, ...string[]];

export const searchQuerySchema = (...orders: OrderList) => z.object({
  search: z.string().optional(),
  page: z.coerce.number().default(1),
  size: z.coerce.number().default(20),
  order: z.enum(orders).default(orders[0]),
  sort: z.enum(['asc', 'desc']).default('asc')
});
