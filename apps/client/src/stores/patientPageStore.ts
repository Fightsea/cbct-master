import { createStore } from 'zustand'

type Store = {
  isOpenPatientDialog: boolean
  openPatientDialog: () => void
  closePatientDialog: () => void

  isSubmitting: boolean
  setIsSubmitting: (isSubmitting: boolean) => void

  patientId: uuid | null
  setPatientId: (id: uuid | null) => void

  isOpenPatientDetailDialog: boolean
  openPatientDetailDialog: (id: uuid) => void
  closePatientDetailDialog: () => void

  aiAnalysisPatientId: uuid | null
  isOpenAiAnalysisDialog: boolean
  openAiAnalysisDialog: (id: uuid) => void
  closeAiAnalysisDialog: () => void

  isOpenCreateDiagnosisDialog: boolean
  openCreateDiagnosisDialog: () => void
  closeCreateDiagnosisDialog: () => void

  handleMutateAllTables: (() => void) | null
  setHandleMutateAllTables: (handler: () => void) => void
}

export const patientPageStore = createStore<Store>()((set) => ({
  isOpenPatientDialog: false,
  openPatientDialog: () => set({ isOpenPatientDialog: true }),
  closePatientDialog: () => set((state) => {
    state.handleMutateAllTables?.()
    return { isOpenPatientDialog: false }
  }),

  isSubmitting: false,
  setIsSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),

  patientId: null,
  setPatientId: (id: uuid | null) => set({ patientId: id }),
  isOpenPatientDetailDialog: false,
  openPatientDetailDialog: (id: uuid) => set({ isOpenPatientDetailDialog: true, patientId: id }),
  closePatientDetailDialog: () => set((state) => {
    state.handleMutateAllTables?.()
    return { isOpenPatientDetailDialog: false, patientId: null }
  }),

  aiAnalysisPatientId: null,
  isOpenAiAnalysisDialog: false,
  openAiAnalysisDialog: (id: uuid) => set({ isOpenAiAnalysisDialog: true, aiAnalysisPatientId: id }),
  closeAiAnalysisDialog: () => set({ isOpenAiAnalysisDialog: false, aiAnalysisPatientId: null }),

  isOpenCreateDiagnosisDialog: false,
  openCreateDiagnosisDialog: () => set({ isOpenCreateDiagnosisDialog: true }),
  closeCreateDiagnosisDialog: () => set({ isOpenCreateDiagnosisDialog: false }),

  handleMutateAllTables: null,
  setHandleMutateAllTables: (handler: () => void) => set({ handleMutateAllTables: handler })
}))
