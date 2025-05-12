import ApiService from '@/apis/apiService'
import { type CreateRequest } from '@/types/oralScanRecord'
import { type GetRecordsRequest } from '@cbct/api/request/oralScanRecord'
import { type GetRecordsResponse } from '@cbct/api/response/oralScanRecord'

const oralScanRecordService = new ApiService({})

const oralScanRecordApi = {
  getRecords: (patientId: string) => oralScanRecordService.get<GetRecordsRequest, GetRecordsResponse>('oral-scan/records', { patientId }),
  create: (data: CreateRequest, config?: { onUploadProgress: (progressEvent: any) => void }) => {
    const formData = new FormData()
    formData.append('patientId', data.patientId)

    data.files.forEach(file => {
      formData.append('files', file)
    })

    return oralScanRecordService.post<CreateRequest, null>(
      'oral-scan/records',
      formData as unknown as CreateRequest,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 600000,
        onUploadProgress: config?.onUploadProgress
      }
    )
  }
}

export default oralScanRecordApi
