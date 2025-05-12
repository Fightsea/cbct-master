import ApiService from '@/apis/apiService'
import { type CreateRequest } from '@/types/cbctRecord'
import { type GetRecordsRequest } from '@cbct/api/request/cbctRecord'
import { type GetRecordsResponse } from '@cbct/api/response/cbctRecord'

const cbctRecordService = new ApiService({})

const cbctRecordApi = {
  getRecords: (patientId: uuid) => cbctRecordService.get<GetRecordsRequest, GetRecordsResponse>('cbct/records', { patientId }),
  create: (data: CreateRequest, config?: { onUploadProgress: (progressEvent: any) => void }) => {
    const formData = new FormData()
    formData.append('patientId', data.patientId)

    data.images.forEach(image => {
      formData.append('images', image)
    })

    return cbctRecordService.post<CreateRequest, null>(
      'cbct/records',
      formData as unknown as CreateRequest,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 600000,
        onUploadProgress: config?.onUploadProgress
      }
    )
  }
}

export default cbctRecordApi
