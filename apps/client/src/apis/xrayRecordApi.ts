import ApiService from '@/apis/apiService'
import { type CreateRequest } from '@/types/xrayRecord'
import { type GetRecordsRequest } from '@cbct/api/request/xrayRecord'
import { type GetRecordsResponse } from '@cbct/api/response/xrayRecord'

const xrayRecordService = new ApiService({})

const xrayRecordApi = {
  getRecords: (patientId: string) => xrayRecordService.get<GetRecordsRequest, GetRecordsResponse>('xray/records', { patientId }),
  create: (data: CreateRequest, config?: { onUploadProgress: (progressEvent: any) => void }) => {
    const formData = new FormData()
    formData.append('patientId', data.patientId)

    data.images.forEach(image => {
      formData.append('images', image)
    })

    return xrayRecordService.post<CreateRequest, null>(
      'xray/records',
      formData as unknown as CreateRequest,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 600000,
        onUploadProgress: config?.onUploadProgress
      }
    )
  }
}

export default xrayRecordApi
