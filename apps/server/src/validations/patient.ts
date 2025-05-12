import { z } from 'zod';
import {
  searchWithPagingQuerySchema,
  createRequestBodySchema,
  updateRequestBodySchema,
  switchStatusRequestBodySchema,
  updatePinnedRequestBodySchema
} from '@cbct/api/request/patient';
import { Header } from '@/constants/enum/http';

const headersSchema = z.object({
  [Header.X_CLINIC_ID]: z.string().uuid()
});

export const searchWithPagingValidation = {
  headers: headersSchema,
  query: searchWithPagingQuerySchema
};

export const getByIdValidation = {
  params: z.object({
    id: z.string().uuid()
  })
};

export const getAvatarValidation = {
  params: z.object({
    id: z.string().uuid()
  })
};

export const getHistoryValidation = {
  params: z.object({
    id: z.string().uuid()
  })
};

export const getOsaRiskValidation = {
  params: z.object({
    id: z.string().uuid()
  })
};

export const createValidation = {
  headers: headersSchema,
  body: createRequestBodySchema
};

export const updateValidation = {
  params: z.object({
    id: z.string().uuid()
  }),
  body: updateRequestBodySchema
};

export const switchStatusValidation = {
  params: z.object({
    id: z.string().uuid()
  }),
  body: switchStatusRequestBodySchema
};

export const updatePinnedValidation = {
  params: z.object({
    id: z.string().uuid()
  }),
  body: updatePinnedRequestBodySchema
};
