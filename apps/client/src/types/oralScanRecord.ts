import { z } from 'zod'
import { createRequestBodySchema as createOralScanRequestBodySchema } from '@cbct/api/request/oralScanRecord'

export const createRequestBodySchema = createOralScanRequestBodySchema.extend({
  files: z.array(
    z
      .custom<File>((val: unknown) => (!val || val instanceof File), '請選擇dcm檔案')
      .refine((file: File) => {
        if (!file) return true
        return file.name.toLowerCase().endsWith('.stl')
      }, '檔案格式不符')
  )
})

export type CreateRequest = z.infer<typeof createRequestBodySchema>
