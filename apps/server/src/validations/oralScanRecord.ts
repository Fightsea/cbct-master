import { z } from 'zod';
import {
  getRecordsRequestQuerySchema,
  createRequestBodySchema
} from '@cbct/api/request/oralScanRecord';

export const getRecordsValidation = {
  query: getRecordsRequestQuerySchema
};

export const createValidation = {
  body: createRequestBodySchema
};

export const getByIdValidation = {
  params: z.object({
    id: z.string().uuid()
  })
};
