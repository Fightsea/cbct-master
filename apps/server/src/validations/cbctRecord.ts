import { z } from 'zod';
import {
  getRecordsRequestQuerySchema,
  createRequestBodySchema
} from '@cbct/api/request/cbctRecord';

export const getRecordsValidation = {
  query: getRecordsRequestQuerySchema
};

export const getByIdValidation = {
  params: z.object({
    id: z.string().uuid()
  })
};

export const getAiOutputValidation = {
  params: z.object({
    id: z.string().uuid()
  })
};

export const createValidation = {
  body: createRequestBodySchema
};
