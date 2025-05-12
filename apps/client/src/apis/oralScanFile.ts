import ApiService from '@/apis/apiService'

const oralScanFileService = new ApiService({})

const oralScanFileApi = {
  delete: (id: string) => oralScanFileService.delete(`oral-scan/files/${id}`)
}

export default oralScanFileApi
