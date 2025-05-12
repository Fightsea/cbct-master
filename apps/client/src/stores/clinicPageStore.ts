import { createStore } from 'zustand'

type Store = {
  isOpenCreateClinicDialog: boolean
  openCreateClinicDialog: () => void
  closeCreateClinicDialog: () => void
}

export const clinicPageStore = createStore<Store>()((set) => ({
  isOpenCreateClinicDialog: false,
  openCreateClinicDialog: () => set({ isOpenCreateClinicDialog: true }),
  closeCreateClinicDialog: () => set({ isOpenCreateClinicDialog: false })
}))
