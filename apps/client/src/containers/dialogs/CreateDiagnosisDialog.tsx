import { patientPageStore } from '@/stores/patientPageStore'
import { DiagnosisAnalysisType } from '@cbct/enum/diagnosisAnalysis'
import DiagnosisChip from '@/components/chips/DiagnosisChip'
import { useStore } from 'zustand'
import { Box, Button, DialogActions, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useEffect, useState } from 'react'
import { SnackbarContext } from '@/contexts/SnackbarContext'
import diagnosisApi from '@/apis/diagnosisApi'
import { type CreateRequest, createRequestBodySchema } from '@cbct/api/request/diagnosis'
import FormTagSelector from '@/components/forms/FormTagSelector'
import FilledFormInput from '@/components/forms/FilledFormInput'
import { authStore } from '@/stores/authStore'
import dayjs from 'dayjs'
import PatientAvatar from '@/components/images/PatientAvatar'


const TimeDisplayer = () => {
  const [displayTime, setDisplayTime] = useState(dayjs())

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayTime(dayjs())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Typography sx={{ fontSize: 12, fontFamily: 'Roboto', fontStyle: 'normal', fontWeight: 400 }}>
      {displayTime.format('YYYY - MM - DD')} {displayTime.format('HH:mm:ss')}
    </Typography>
  )
}

type Props = {
  mutateHistory: () => void
}

const CreateDiagnosisDialog = ({ mutateHistory }: Props) => {
  const { user } = useStore(authStore)
  const { patientId, isOpenCreateDiagnosisDialog, closeCreateDiagnosisDialog } = useStore(patientPageStore)
  const { openSnackbar } = useContext(SnackbarContext)
  const [isValid, setIsValid] = useState(false)

  const defaultValues = {
    patientId: patientId ?? '',
    doctorId: user?.id ?? '',
    datetime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    note: undefined,
    tagIds: []
  }

  const form = useForm<CreateRequest>({
    resolver: zodResolver(createRequestBodySchema),
    defaultValues
  })

  const onSubmit = (data: CreateRequest) => {
    diagnosisApi.create(data)
      .then(() => {
        openSnackbar({
          message: 'Create successfully',
          severity: 'success'
        })
        mutateHistory()
        closeCreateDiagnosisDialog()
      })
      .catch(() => {
        openSnackbar({
          message: 'Create failed',
          severity: 'error'
        })
      })
  }

  useEffect(() => {
    if (isOpenCreateDiagnosisDialog) {
      form.reset(defaultValues)
    }
  }, [isOpenCreateDiagnosisDialog])

  useEffect(() => {
    setIsValid(form.formState.isValid)
  }, [form.formState.isValid])

  return (
    <Dialog
      open={isOpenCreateDiagnosisDialog}
      fullWidth
      maxWidth={'sm'}
      onClose={(_, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return
        }
        closeCreateDiagnosisDialog()
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        height: 64,
        px: 4,
        fontSize: 22,
        fontStyle: 'normal',
        fontWeight: 700
      }}>
        <DiagnosisChip diagnosis={DiagnosisAnalysisType.DIAGNOSIS} />
        <TimeDisplayer />
      </DialogTitle>
      <IconButton
        aria-label={'close'}
        onClick={closeCreateDiagnosisDialog}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500]
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ px: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
          <PatientAvatar patientId={patientId ?? ''} sx={{ width: 40, height: 40, borderRadius: '50%' }} />
          <Typography sx={{ fontSize: 14, fontStyle: 'normal', fontWeight: 400 }}>
            {user?.name} {user?.position}
          </Typography>
        </Box>
        <FormProvider {...form}>
          <Stack
            spacing={2}
            sx={{ width: '100%' }}
          >
            <FilledFormInput
              name={'note'}
              label={'Note'}
              placeholder={'Note'}
              required
              fullWidth
              multiline
              rows={10}
            />
            <FormTagSelector
              name={'tagIds'}
              label={'Tags'}
              labelColor={'#262626'}
            />
          </Stack>
        </FormProvider>
      </DialogContent>
      <DialogActions sx={{ px: 4, py: 3 }}>
        <Button
          sx={{ width: 120, height: 48 }}
          variant={'primary'}
          onClick={() => {
            form.setValue('datetime', dayjs().format('YYYY-MM-DD HH:mm:ss'))
            form.handleSubmit(onSubmit)()
          }}
          disabled={!isValid}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateDiagnosisDialog

