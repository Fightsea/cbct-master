import { z } from 'zod'
import { createRequestBodySchema as createCBCTRequestBodySchema } from '@cbct/api/request/cbctRecord'

export const createRequestBodySchema = createCBCTRequestBodySchema.extend({
  images: z.array(
    z
      .custom<File>((val: unknown) => (!val || val instanceof File), '請選擇dcm檔案')
      .refine((file: File) => {
        if (!file) return true
        return file.name.toLowerCase().endsWith('.dcm')
      }, '檔案格式不符')
  )
})

export type CreateRequest = z.infer<typeof createRequestBodySchema>
