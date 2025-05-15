import { z } from 'zod';
import { Gender } from '@cbct/enum/user';
import { TreatmentStatus } from '@cbct/enum/patient';
import { searchQuerySchema } from '../utils/schema.base';

export const searchWithPagingQuerySchema = searchQuerySchema(
  'serialNumber',
  'treatmentStatus',
  'name',
  'osaRisk',
  'note',
  'createdAt'
).extend({
  treatmentStatus: z.nativeEnum(TreatmentStatus)
}).strict();

export type SearchWithPagingRequest = z.infer<typeof searchWithPagingQuerySchema>;

export const searchHistoryQuerySchema = z.object({ search: z.string().optional() }).strict()

export type SearchHistoryRequest = z.infer<typeof searchHistoryQuerySchema>

export const createRequestBodySchema = z.object({
  serialNumber: z.string().regex(/^\d{8}$/),
  email: z
    .string()
    .email('請輸入有效的電子郵件格式')
    .min(1)
    .max(50, '電子郵件長度不能超過 50 個字元')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, '請輸入正確的電子郵件格式' ),
  idNumber: z.string().regex(/^[A-Z]\d{9}$/, {  message: '身分證字號格式錯誤' }),
  treatmentStatus: z.nativeEnum(TreatmentStatus),
  firstName: z.string().min(1).max(30),
  lastName: z.string().min(1).max(30),
  gender: z.nativeEnum(Gender),
  birthday: z.string().date(),
  phone: z.string().regex(/^09\d{8}$/, '手機號碼格式必須是 09 開頭的 10 位數字'),
  height: z.coerce.number().min(0, '身高不能小於 0').max(300, '身高不能超過 300 公分'),
  weight: z.coerce.number().min(0, '體重不能小於 0').max(300, '體重不能超過 300 公斤'),
  note: z.string().optional(),
  tagIds: z.array(z.string().uuid()).min(0)
}).strict();

export type CreateRequest = z.infer<typeof createRequestBodySchema>;

export const updateRequestBodySchema = createRequestBodySchema.omit({ serialNumber: true });

export type UpdateRequest = z.infer<typeof updateRequestBodySchema>;

export const switchStatusRequestBodySchema = z.object({
  treatmentStatus: z.nativeEnum(TreatmentStatus)
}).strict();

export type SwitchStatusRequest = z.infer<typeof switchStatusRequestBodySchema>;

export const updatePinnedRequestBodySchema = z.object({
  pinned: z.boolean()
}).strict();

export type UpdatePinnedRequest = z.infer<typeof updatePinnedRequestBodySchema>;
