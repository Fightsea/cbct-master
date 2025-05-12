import { z } from 'zod'
import { createRequestBodySchema as createClinicRequestBodySchema } from '@cbct/api/request/clinic'

export const createRequestBodySchema = createClinicRequestBodySchema.extend({
  image: z
    .custom<File>((val: unknown) => (val && val instanceof File), '請選擇檔案')
    .refine((file: File) => {
      if (!file) return true
      return ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
    }, '檔案格式不符')
})

export type CreateRequest = z.infer<typeof createRequestBodySchema>
