import { createContext, useState, useCallback, ReactNode } from 'react'
import { Alert, AlertProps, Slide, Snackbar, SnackbarProps } from '@mui/material'

type Props = Omit<SnackbarProps, 'open'> & {
  severity: AlertProps['severity']
}

type SnackbarContextType = {
  openSnackbar: (_props: Props) => void;
}

export const SnackbarContext = createContext<SnackbarContextType>({ openSnackbar: () => {} })

type SnackbarProviderProps = {
  children: ReactNode
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [snackbarProps, setSnackbarProps] = useState<Omit<SnackbarProps, 'open'>>({})
  const [severity, setSeverity] = useState<AlertProps['severity']>('info')

  const openSnackbar = useCallback(({
    severity,
    anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
    autoHideDuration = 1800,
    TransitionComponent = Slide,
    ...props
  }: Props) => {
    setSnackbarProps({ anchorOrigin, autoHideDuration, TransitionComponent, ...props })
    setIsOpen(true)
    setSeverity(severity)
  }, [])

  const closeSnackbar = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <SnackbarContext.Provider value={{ openSnackbar }}>
      {children}
      <Snackbar
        open={isOpen}
        onClose={closeSnackbar}
        {...snackbarProps}
      >
        <Alert
          onClose={closeSnackbar}
          severity={severity}
          variant={'filled'}
          sx={{ width: '100%', fontSize: 16 }}
        >
          {snackbarProps.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
