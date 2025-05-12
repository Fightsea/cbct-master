import { z } from 'zod';

export const deleteValidation = {
  params: z.object({
    id: z.string().uuid()
  })
};
