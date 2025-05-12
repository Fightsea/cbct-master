import { createStore } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { LoginResponse } from '@cbct/api/response/auth'
import { AES, enc } from 'crypto-js'

type Store = {
  user: Nullable<LoginResponse['user']>
  accessToken: Nullable<LoginResponse['accessToken']>
  refreshToken: Nullable<LoginResponse['refreshToken']>
  email: Nullable<string>
  clinicId: Nullable<uuid>
  login: (_loginResponse: LoginResponse, _email: Nullable<string>) => void
  logout: () => void
  setClinicId: (clinicId: Nullable<uuid>) => void
}

const encryptedStorage = createJSONStorage(() => localStorage, {
  reviver: (_, value) => {
    return JSON.parse(AES.decrypt(value as string, process.env.NEXT_PUBLIC_AUTH_STORE_ENCRYPTION_KEY as string).toString(enc.Utf8))
  },
  replacer: (_, value) => {
    return AES.encrypt(JSON.stringify(value) as string, process.env.NEXT_PUBLIC_AUTH_STORE_ENCRYPTION_KEY as string).toString()
  }
})

export const authStore = createStore<Store>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        email: null,
        clinicId: null,
        login: (loginResponse, email) => set({ ...loginResponse, email }),
        logout: () => {
          return set({ user: null, accessToken: null, refreshToken: null })
        },
        setClinicId: (clinicId) => set({ clinicId })
      }),
      {
        name: 'auth-store',
        storage: encryptedStorage
      }
    )
  )
)
