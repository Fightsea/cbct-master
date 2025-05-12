import ApiService from '@/apis/apiService'
import { type SwitchTypeRequest } from '@cbct/api/request/patientPhoto'
import { type UploadRequest } from '@/types/patientPhoto'
import { GetTaggedResponse, type GetPhotosResponse } from '@cbct/api/response/patientPhoto'

const patientPhotoService = new ApiService({})

const patientPhotoApi = {
  getPhotos: (patientId: string) => {
    return patientPhotoService.get<null, GetPhotosResponse>(`patient-photos/${patientId}`)
  },
  getTagged: (patientId: string) => {
    return patientPhotoService.get<null, GetTaggedResponse>(`patient-photos/${patientId}/tagged`)
  },
  upload: (data: UploadRequest, config?: { onUploadProgress: (progressEvent: any) => void }) => {
    const formData = new FormData()
    formData.append('patientId', data.patientId)
    if (data.frontFileName) formData.append('frontFileName', data.frontFileName)
    if (data.profileFileName) formData.append('profileFileName', data.profileFileName)

    data.images.forEach(image => {
      formData.append('images', image)
    })

    return patientPhotoService.post<UploadRequest, null>(
      'patient-photos',
      formData as unknown as UploadRequest,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 600000,
        onUploadProgress: config?.onUploadProgress
      }
    )
  },
  switchType: (id: uuid, data: SwitchTypeRequest) => {
    return patientPhotoService.put<SwitchTypeRequest, null>(`patient-photos/${id}/type`, data)
  },
  delete: (id: uuid) => {
    return patientPhotoService.delete<null, null>(`patient-photos/${id}`)
  }
}

export default patientPhotoApi
