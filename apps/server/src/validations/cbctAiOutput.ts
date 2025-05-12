import { z } from 'zod';
import {
  createRequestBodySchema,
  completeRequestBodySchema
} from '@cbct/api/request/cbctAiOutput';

export const getInputImagesValidation = {
  params: z.object({
    id: z.string().uuid()
  })
};

export const createValidation = {
  body: createRequestBodySchema
};

export const completeValidation = {
  body: completeRequestBodySchema
};
