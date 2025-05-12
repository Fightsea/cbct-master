import { createStore } from 'zustand'

type StepState = {
  isValid: boolean
  isUploaded: boolean
}

type Store = {
  patientId: string | null
  setPatientId: (patientId: string | null) => void

  isSubmitting: boolean
  setIsSubmitting: (isSubmitting: boolean) => void

  stepsStates: StepState[]
  setStepValid: (step: number, isValid: boolean) => void
  setStepUploaded: (step: number, isUploaded: boolean) => void

  resetAllSteps: () => void
}

export const createPatientDialogStore = createStore<Store>()((set, get) => ({
  patientId: null,
  setPatientId: (patientId: string | null) => set({ patientId }),

  isSubmitting: false,
  setIsSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),

  stepsStates: Array.from({ length: 5 }, () => ({ isValid: false, isUploaded: false })),
  setStepValid: (step: number, isValid: boolean) => {
    const newStepsStates = [...get().stepsStates]
    newStepsStates[step - 1].isValid = isValid
    set({ stepsStates: newStepsStates })
  },
  setStepUploaded: (step: number, isUploaded: boolean) => {
    const newStepsStates = [...get().stepsStates]
    newStepsStates[step - 1].isUploaded = isUploaded
    set({ stepsStates: newStepsStates })
  },

  resetAllSteps: () => set({
    stepsStates: Array.from({ length: 5 }, () => ({ isValid: false, isUploaded: false }))
  })
}))
