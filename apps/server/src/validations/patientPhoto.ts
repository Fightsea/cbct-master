import { z } from 'zod';
import {
  uploadRequestBodySchema,
  switchTypeRequestBodySchema
} from '@cbct/api/request/patientPhoto';

export const getPhotosValidation = {
  params: z.object({
    patientId: z.string().uuid()
  })
};

export const getTaggedValidation = {
  params: z.object({
    patientId: z.string().uuid()
  })
};

export const uploadValidation = {
  body: uploadRequestBodySchema
};

export const switchTypeValidation = {
  params: z.object({
    id: z.string().uuid()
  }),
  body: switchTypeRequestBodySchema
};

export const deleteValidation = {
  params: z.object({
    id: z.string().uuid()
  })
};
