import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter'
import { useEffect, useState } from 'react'
import { SnackbarProvider } from '@/contexts/SnackbarContext'
import { SWRConfig } from 'swr'
import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import { theme } from '@/containers/layouts/theme'
import Header from '@/containers/layouts/Header'
import SideNav from '@/containers/layouts/SideNav'
import { NextPage } from 'next'
import { usePathname } from 'next/navigation'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { authStore } from '@/stores/authStore'
import { useStore } from 'zustand'
import DeleteConfirmDialog from '@/containers/dialogs/DeleteConfirmDialog'
import ImagePreviewer from '@/components/images/ImagePreviewer'
import DCMPreviewer from '@/components/images/DCMPreviewer'

type CustomComponentProps = NextPage & {
  title: string
}

const App = ({ Component, pageProps }: AppProps & { Component: CustomComponentProps }) => {
  // Make sure to render the page after Next.js rehydration completes
  const [isHydrated, setIsHydrated] = useState(false)
  const path = usePathname()
  const { clinicId } = useStore(authStore)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    // Skip check for public routes
    if (path === '/' || path === '/login') return

    // Redirect to index if no clinicId
    if (isHydrated &&!clinicId) {
      window.location.href = '/'
    }
  }, [clinicId, path, isHydrated])

  return (
    <SWRConfig value={{
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }}>
      {isHydrated && (
        <SnackbarProvider>
          <AppCacheProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{
                  position: 'relative',
                  display: 'flex',
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden'
                }}>
                  {path !== '/' && path !== '/login' && <SideNav />}
                  <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                    {path !== '/' && path !== '/login' && <Header title={Component.title}/>}
                    <Component {...pageProps} />
                  </Box>
                  <DeleteConfirmDialog />
                  <ImagePreviewer />
                  <DCMPreviewer />
                </Box>
              </ThemeProvider>
            </LocalizationProvider>
          </AppCacheProvider>
        </SnackbarProvider>
      )}
    </SWRConfig>
  )
}

export default App
