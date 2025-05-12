import { createStore } from 'zustand'

type Store = {
  // delete dialog
  isOpen: boolean
  deleteFunc: () => void

  openDeleteDialog: (func: () => void) => void
  handleDelete: () => void
  closeDeleteDialog: () => void

  // image preview
  imageUrls: string[]
  imageIndex: number
  openImagePreview: (urls: string[], index: number) => void
  closeImagePreview: () => void
  nextImage: () => void
  prevImage: () => void

  // dcm preview
  dcmUrls: string[]
  dcmIndex: number
  openDcmPreview: (urls: string[], index: number) => void
  closeDcmPreview: () => void
  nextDcm: () => void
  prevDcm: () => void
}

export const globalStore = createStore<Store>()((set, get) => ({
  // delete dialog
  isOpen: false,
  deleteFunc: () => {},

  openDeleteDialog: (func: () => void) => set({ isOpen: true, deleteFunc: func }),
  handleDelete: () => {
    get().deleteFunc()
    get().closeDeleteDialog()
  },
  closeDeleteDialog: () => set({ isOpen: false, deleteFunc: () => {} }),

  // image preview
  imageUrls: [],
  imageIndex: 0,
  openImagePreview: (urls: string[], index: number) => set({ imageUrls: urls, imageIndex: index }),
  closeImagePreview: () => set({ imageUrls: [], imageIndex: 0 }),
  nextImage: () => set((state) => ({
    imageIndex: state.imageIndex + 1 >= state.imageUrls.length ? 0 : state.imageIndex + 1
  })),
  prevImage: () => set((state) => ({
    imageIndex: state.imageIndex - 1 < 0 ? state.imageUrls.length - 1 : state.imageIndex - 1
  })),

  // dcm preview
  dcmUrls: [],
  dcmIndex: 0,
  openDcmPreview: (urls: string[], index: number) => set({ dcmUrls: urls, dcmIndex: index }),
  closeDcmPreview: () => set({ dcmUrls: [], dcmIndex: 0 }),
  nextDcm: () => set((state) => ({
    dcmIndex: state.dcmIndex + 1 >= state.dcmUrls.length ? 0 : state.dcmIndex + 1
  })),
  prevDcm: () => set((state) => ({
    dcmIndex: state.dcmIndex - 1 < 0 ? state.dcmUrls.length - 1 : state.dcmIndex - 1
  }))
}))
