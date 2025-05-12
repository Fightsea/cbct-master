import ApiService from '@/apis/apiService'
import { CreateRequest } from '@cbct/api/request/diagnosis'

const diagnosisService = new ApiService({})

const diagnosisApi = {
  create: (data: CreateRequest) => {
    return diagnosisService.post<CreateRequest, null>('diagnoses', data)
  }
}

export default diagnosisApi
