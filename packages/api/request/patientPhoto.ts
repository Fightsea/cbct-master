import { z } from 'zod';
import regex from '../utils/regex';
import { PatientPhotoType } from '@cbct/enum/patientPhoto';

export const uploadRequestBodySchema = z.object({
  frontFileName: z.string().regex(regex.imageFile).nullish(),
  profileFileName: z.string().regex(regex.imageFile).nullish(),
  patientId: z.string().uuid()
}).strict();

export type UploadRequest = z.infer<typeof uploadRequestBodySchema>;

export const switchTypeRequestBodySchema = z.object({
  type: z.enum([PatientPhotoType.FRONT, PatientPhotoType.PROFILE])
}).strict();

export type SwitchTypeRequest = z.infer<typeof switchTypeRequestBodySchema>;
