import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack } from '@mui/material'
import { clinicPageStore } from '@/stores/clinicPageStore'
import CloseIcon from '@mui/icons-material/Close'
import { useStore } from 'zustand'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateRequest, createRequestBodySchema } from '@/types/clinic'
import FormInput from '@/components/forms/FormInput'
import { useContext, useEffect } from 'react'
import clinicApi from '@/apis/clinicApi'
import { SnackbarContext } from '@/contexts/SnackbarContext'
import FormImageUpload from '@/components/forms/FormImageUpload'

type Props = {
  mutateClinics: () => void
}

const CreateClinicDialog = ({ mutateClinics }: Props) => {
  const { isOpenCreateClinicDialog, closeCreateClinicDialog } = useStore(clinicPageStore)

  const { openSnackbar } = useContext(SnackbarContext)

  const form = useForm<CreateRequest>({
    resolver: zodResolver(createRequestBodySchema)
  })

  const onSubmit = (data: CreateRequest) => {
    clinicApi.create(data)
      .then(() => {
        mutateClinics()
        closeCreateClinicDialog()
        openSnackbar({
          message: 'Create clinic successfully',
          severity: 'success'
        })
      })
      .catch(error => {
        openSnackbar({
          message: error.message,
          severity: 'error'
        })
      })
  }


  form.watch('image')

  useEffect(() => {
    if (isOpenCreateClinicDialog) {
      form.reset()
    }
  }, [isOpenCreateClinicDialog])

  return (
    <Dialog
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
          background: '#32364f'
        }
      }}
      open={isOpenCreateClinicDialog}
      fullWidth
      maxWidth={'sm'}
      onClose={(_, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return
        }
        closeCreateClinicDialog()
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 64,
        color: '#fff',
        fontSize: 22,
        fontWeight: 600
      }}>
        Create Clinic
      </DialogTitle>
      <IconButton
        aria-label={'close'}
        onClick={closeCreateClinicDialog}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: '#fff'
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        px: 4
      }}>
        <Stack
          spacing={2}
          sx={{ width: '100%' }}
        >
          <FormProvider {...form}>
            <FormImageUpload name={'image'}/>
            <FormInput
              name={'name'}
              label={'Clinic Name'}
              placeholder={'Name'}
              required
              fullWidth
            />
            <FormInput
              name={'taxId'}
              label={'Tax ID'}
              placeholder={'Tax ID'}
              required
              fullWidth
            />
            <FormInput
              name={'phone'}
              label={'Phone'}
              placeholder={'Phone'}
              required
              fullWidth
            />
            <FormInput
              name={'address'}
              label={'Address'}
              placeholder={'Address'}
              required
              fullWidth
            />
          </FormProvider>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ pb: 4, px: 4 }}>
        <Button
          sx={{ width: '100%' }}
          variant={'primary'}
          onClick={() => form.handleSubmit(onSubmit)()}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateClinicDialog
