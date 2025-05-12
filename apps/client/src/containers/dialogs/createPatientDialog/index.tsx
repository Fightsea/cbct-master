import { useContext, useEffect, useRef, useState } from 'react'
import { patientPageStore } from '@/stores/patientPageStore'
import { Dialog, DialogContent, DialogTitle, IconButton, Button, DialogActions, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useStore } from 'zustand'
import Stepper, { StepperHandle } from '@/components/steppers/Stepper'
import PersonalDetailForm, { PersonalDetailFormHandle } from './PersonalDetailForm'
import { CreateRequest } from '@cbct/api/request/patient'
import patientApi from '@/apis/patientApi'
import { SnackbarContext } from '@/contexts/SnackbarContext'
import PatientPhotoForm, { PatientPhotoFormHandle } from './PatientPhotoForm'
import { type UploadRequest as UploadPatientPhotoRequest } from '@/types/patientPhoto'
import patientPhotoApi from '@/apis/patientPhotoApi'
import CBCTRecordForm, { CBCTRecordFormHandle } from './CBCTRecordForm'
import { type CreateRequest as CreateCBCTRequest } from '@/types/cbctRecord'
import cbctRecordApi from '@/apis/cbctRecordApi'
import XRayRecordForm, { XRayRecordFormHandle } from './XRayRecordForm'
import { type CreateRequest as CreateXRayRequest } from '@/types/xrayRecord'
import xrayRecordApi from '@/apis/xrayRecordApi'
import OralScanRecordForm, { OralScanRecordFormHandle } from './OralScanRecordForm'
import { type CreateRequest as CreateOralScanRequest } from '@/types/oralScanRecord'
import oralScanRecordApi from '@/apis/oralScanRecordApi'
import CreatedBox from './CreatedBox'
import { createPatientDialogStore } from '@/stores/createPatientDialogStore'
import UploadProgress from '@/components/progress/UploadProgress'
import AiAnalysisDialog from '@/containers/dialogs/AiAnalysisDialog.tsx'

type Props = {
  mutatePatient: () => void
}

const CreatePatientDialog = ({ mutatePatient }: Props) => {
  const [curStep, setCurStep] = useState(1)
  const {
    isOpenPatientDialog,
    closePatientDialog,
    openAiAnalysisDialog,
    setPatientId: setCreatedPatientId
  } = useStore(patientPageStore)
  const {
    resetAllSteps,
    isSubmitting,
    setIsSubmitting,
    patientId,
    setPatientId,
    stepsStates,
    setStepUploaded
  } = useStore(createPatientDialogStore)
  const stepperRef = useRef<StepperHandle>(null)
  const personalDetailFormRef = useRef<PersonalDetailFormHandle>(null)
  const patientPhotoFormRef = useRef<PatientPhotoFormHandle>(null)
  const cbctRecordFormRef = useRef<CBCTRecordFormHandle>(null)
  const xrayRecordFormRef = useRef<XRayRecordFormHandle>(null)
  const oralScanRecordFormRef = useRef<OralScanRecordFormHandle>(null)
  const { openSnackbar } = useContext(SnackbarContext)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const handleFirstStepSubmit = async (data: CreateRequest) => {
    if (patientId) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { serialNumber, ...rest } = data
      await patientApi.update(patientId, rest)
        .then(() => {
          stepperRef.current?.handleNext()
        })
        .catch(() => {
          openSnackbar({
            message: 'Update error',
            severity: 'error'
          })
        })
    } else {
      setIsUploading(true)
      await patientApi.create(data)
        .then((res) => {
          if ((res.message) === 'SN_REGENERATED') {
            openSnackbar({
              message: 'Serial number regenerated',
              severity: 'success'
            })
          }
          setPatientId(res.id)
          setCreatedPatientId(res.id)
          setStepUploaded(1, true)
          stepperRef.current?.handleNext()
        })
        .catch(() => {
          openSnackbar({
            message: 'Create error',
            severity: 'error'
          })
        })
        .finally(() => {
          setIsUploading(false)
        })
    }
  }

  const handleSecondStepSubmit = async (data: UploadPatientPhotoRequest) => {
    if (stepsStates[1].isUploaded) {
      stepperRef.current?.handleNext()

    } else {
      setIsUploading(true)
      setUploadProgress(0)
      await patientPhotoApi.upload(data, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          )
          setUploadProgress(percentCompleted)
        }
      })
        .then(() => {
          setStepUploaded(2, true)
          stepperRef.current?.handleNext()
        })
        .catch(() => {
          openSnackbar({
            message: 'Upload error',
            severity: 'error'
          })
        })
        .finally(() => {
          setIsUploading(false)
          setUploadProgress(0)
        })
    }
  }

  const handleThirdStepSubmit = async (data: CreateCBCTRequest) => {
    if (stepsStates[2].isUploaded) {
      stepperRef.current?.handleNext()
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    await cbctRecordApi.create(data, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 100)
        )
        setUploadProgress(percentCompleted)
      }
    })
      .then(() => {
        setStepUploaded(3, true)
        stepperRef.current?.handleNext()
      })
      .catch(() => {
        openSnackbar({
          message: 'Upload error',
          severity: 'error'
        })
      })
      .finally(() => {
        setIsUploading(false)
        setUploadProgress(0)
      })
  }

  const handleFourthStepSubmit = async (data: CreateXRayRequest) => {
    if (stepsStates[3].isUploaded) {
      stepperRef.current?.handleNext()
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    await xrayRecordApi.create(data, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 100)
        )
        setUploadProgress(percentCompleted)
      }
    })
      .then(() => {
        setStepUploaded(4, true)
        stepperRef.current?.handleNext()
      })
      .catch(() => {
        openSnackbar({
          message: 'Upload error',
          severity: 'error'
        })
      })
      .finally(() => {
        setIsUploading(false)
        setUploadProgress(0)
      })
  }

  const handleFifthStepSubmit = async (data: CreateOralScanRequest) => {
    if (data.files.length > 0) {
      setIsUploading(true)
      setUploadProgress(0)
      await oralScanRecordApi.create(data, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          )
          setUploadProgress(percentCompleted)
        }
      })
        .then(() => {
          setCreatedPatientId(null)
          stepperRef.current?.handleNext()
        })
        .catch(() => {
          openSnackbar({
            message: 'Upload error',
            severity: 'error'
          })
        })
        .finally(() => {
          setIsUploading(false)
          setUploadProgress(0)
        })
    } else {
      stepperRef.current?.handleNext()
    }
  }

  const handleNextClick = async () => {
    setIsSubmitting(true)
    switch (curStep) {
    case 1:
      personalDetailFormRef.current?.handleSubmit()
      break
    case 2:
      patientPhotoFormRef.current?.handleSubmit()
      break
    case 3:
      cbctRecordFormRef.current?.handleSubmit()
      break
    case 4:
      xrayRecordFormRef.current?.handleSubmit()
      break
    case 5:
      oralScanRecordFormRef.current?.handleSubmit()
      break
    }
    setIsSubmitting(false)
  }

  useEffect(() => {
    if (isOpenPatientDialog) {
      setCurStep(1)
      setIsSubmitting(false)
      resetAllSteps()
      setPatientId(null)
    }
  }, [isOpenPatientDialog])

  const steps = [
    {
      label: 'Personal Details',
      description: 'Basic Information',
      createButtonText: stepsStates[0].isUploaded ? 'UPDATE & NEXT' : 'CREATE & NEXT'
    },
    {
      label: 'Photos',
      description: 'Upload Photos',
      createButtonText: 'NEXT'
    },
    {
      label: 'CBCT',
      description: 'Upload CBCT files',
      createButtonText: 'NEXT'
    },
    {
      label: 'X-Ray',
      description: 'Upload X-Ray files',
      createButtonText: 'NEXT'
    },
    {
      label: 'Oral Scan',
      description: 'Upload Oral Scan files',
      createButtonText: 'SUBMIT'
    }
  ]

  const getStepsWithIsFinished = () => {
    return steps.map((step, index) => ({
      ...step,
      isFinished: stepsStates[index].isUploaded
    }))
  }

  const handleNextSubmit = () => {
    return stepsStates[curStep - 1].isValid ? handleNextClick() : stepperRef.current?.handleNext()
  }

  return (
    <>
      <Dialog
        open={isOpenPatientDialog}
        PaperProps={{
          sx: {
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: 'calc(100% - 64px)',
            borderRadius: '10px',
            margin: '32px'
          }
        }}
        onClose={(_, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return
          }
          closePatientDialog()
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          height: 64,
          px: 3,
          py: 1.5,
          fontSize: 22,
          fontStyle: 'normal',
          fontWeight: 700
        }}>
          {curStep !== 6 ? 'Created Profile' : 'Create Successfully'}
        </DialogTitle>
        {curStep !== 6 && <Box sx={{ px: 3 }}>
          <Stepper
            steps={getStepsWithIsFinished()}
            ref={stepperRef}
            onStepChange={setCurStep}
          />
        </Box>}
        <IconButton
          aria-label={'close'}
          onClick={() => {
            closePatientDialog()
            mutatePatient()
          }}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500]
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          px: 3,
          py: 0
        }}>
          {curStep !== 6 ? (
            <>
              <Box sx={{
                height: '100%',
                width: '100%',
                px: 6,
                py: 3,
                display: 'flex',
                flexDirection: 'column'
              }}>
                {(() => {
                  switch (curStep) {
                  case 1:
                    return (
                      <PersonalDetailForm
                        ref={personalDetailFormRef}
                        onSubmit={handleFirstStepSubmit}
                      />
                    )
                  case 2:
                    return (
                      isUploading ? (
                        <UploadProgress progress={uploadProgress} />
                      ) : (
                        <PatientPhotoForm
                          ref={patientPhotoFormRef}
                          onSubmit={handleSecondStepSubmit}
                          isUploading={isUploading}
                          progress={uploadProgress}
                        />
                      )
                    )
                  case 3:
                    return (
                      isUploading ? (
                        <UploadProgress progress={uploadProgress} />
                      ) : (
                        <CBCTRecordForm
                          ref={cbctRecordFormRef}
                          onSubmit={handleThirdStepSubmit}
                        />
                      )
                    )
                  case 4:
                    return (
                      isUploading ? (
                        <UploadProgress progress={uploadProgress} />
                      ) : (
                        <XRayRecordForm
                          ref={xrayRecordFormRef}
                          onSubmit={handleFourthStepSubmit}
                        />
                      )
                    )
                  case 5:
                    return (
                      isUploading ? (
                        <UploadProgress progress={uploadProgress} />
                      ) : (
                        <OralScanRecordForm
                          ref={oralScanRecordFormRef}
                          onSubmit={handleFifthStepSubmit}
                        />
                      )
                    )
                  }
                })()}
              </Box>
            </>
          ) : (
            <CreatedBox />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 0 }}>
          {curStep !== 6 ? (
            <Box sx={{ px: 4, pt: 3, pb: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant={'primary'}
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: 1.5,
                  minWidth: 120,
                  height: 48,
                  px: 0
                }}
                onClick={handleNextSubmit}
                type={'submit'}
                disabled={isUploading || (curStep === 1 && (isSubmitting || !stepsStates[0].isValid))}
              >
                {isUploading ? 'UPLOADING...' : steps[curStep - 1].createButtonText}
              </Button>
            </Box>
          ) : (
            <Box sx={{ width: '100%', padding: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant={'cancel'}
                sx={{
                  width: 120,
                  height: 48
                }}
                onClick={closePatientDialog}
              >
              Close
              </Button>
              <Button
                variant={'primary'}
                sx={{
                  width: 120,
                  height: 48
                }}
                onClick={() => {
                  closePatientDialog()
                  openAiAnalysisDialog(patientId ?? '')
                }}
              >
            AI Analysis
              </Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>
      <AiAnalysisDialog mutateHistory={()=> {}} />
    </>
  )
}

export default CreatePatientDialog
