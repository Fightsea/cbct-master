import { z } from 'zod';
import { createRequestBodySchema } from '@cbct/api/request/clinic';

export const getPhotoValidation = {
  params: z.object({
    id: z.string().uuid()
  })
};

export const createValidation = {
  body: createRequestBodySchema
};
