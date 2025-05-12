import { z } from 'zod'
import { uploadRequestBodySchema as uploadPatientPhotoSchema } from '@cbct/api/request/patientPhoto'

export const uploadRequestSchema = uploadPatientPhotoSchema.extend({
  images: z.array(
    z
      .custom<File>((val: unknown) => (!val || val instanceof File), '請選擇大頭貼')
      .refine((file: File) => {
        if (!file) return true
        return ['image/jpg', 'image/jpeg', 'image/png', 'image/heic', 'image/heif'].includes(file.type)
      }, '檔案格式不符')
  )
})

export type UploadRequest = z.infer<typeof uploadRequestSchema>
