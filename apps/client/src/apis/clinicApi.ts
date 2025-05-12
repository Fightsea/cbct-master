import ApiService from '@/apis/apiService'
import { GetAffiliatedResponse, GetPhotoResponse } from '@cbct/api/response/clinic'
import { CreateRequest } from '@/types/clinic'
const clinicService = new ApiService({})

const clinicApi = {
  getAffiliated: () => {
    return clinicService.get<null, GetAffiliatedResponse>('clinics/affiliated', undefined, undefined, false)
  },
  getPhoto: (id: string) => {
    return clinicService.get<null, GetPhotoResponse>(`clinics/${id}/photo`)
  },
  create: (body: CreateRequest) => {
    const formData = new FormData()
    formData.append('name', body.name)
    formData.append('taxId', body.taxId)
    formData.append('phone', body.phone)
    formData.append('address', body.address)
    formData.append('image', body.image)
    return clinicService.post<CreateRequest, null>('clinics', formData as unknown as CreateRequest, { headers: { 'Content-Type': 'multipart/form-data' } })
  }
}

export default clinicApi
