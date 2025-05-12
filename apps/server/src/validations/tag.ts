import { z } from 'zod';
import {
  createRequestBodySchema,
  updateRequestBodySchema
} from '@cbct/api/request/tag';
import { Header } from '@/constants/enum/http';

const headersSchema = z.object({
  [Header.X_CLINIC_ID]: z.string().uuid()
});

export const getByClinicValidation = {
  headers: headersSchema
};

export const createValidation = {
  headers: headersSchema,
  body: createRequestBodySchema
};

export const updateValidation = {
  headers: headersSchema,
  params: z.object({
    id: z.string().uuid()
  }),
  body: updateRequestBodySchema
};

export const deleteValidation = {
  headers: headersSchema,
  params: z.object({
    id: z.string().uuid()
  })
};
