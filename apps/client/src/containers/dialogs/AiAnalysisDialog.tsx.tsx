import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  Typography
} from '@mui/material'
import { useStore } from 'zustand'
import { patientPageStore } from '@/stores/patientPageStore'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import cbctAiOutputApi from '@/apis/cbctAiOutputApi'
import { CbctAiModel } from '@cbct/enum/cbct'
import { type CreateRequest, createRequestBodySchema } from '@cbct/api/request/cbctAiOutput'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { SnackbarContext } from '@/contexts/SnackbarContext'
import cbctOSA from '@/public/cbct-osa.png'
import Image from 'next/image'
import CloseIcon from '@mui/icons-material/Close'
import BlackBorderCheckbox from '@/components/checkboxes/BlackBorderCheckbox'
import DCMPreviewBox from '@/components/boxes/DCMPreviewBox'
import cbctRecordApi from '@/apis/cbctRecordApi'
import useSWR from 'swr'
import ImageUploadBox from '@/components/boxes/ImageUploadBox'
import cbctImageApi from '@/apis/cbctImage'
import UploadPatient from '@/public/upload-patient.png'
import AiAnalysisResult from '@/containers/analysis/AiAnalysisResult'
import UploadProgress from '@/components/progress/UploadProgress'
import ImageUploadErrorDialog from '@/containers/dialogs/ImageUploadErrorDialog'
import { FileTypes, findInvalidFiles } from '@/utils/fileValidator'
import { convertToProxyUrl } from '@/utils/proxy'

type Props = {
  mutateHistory: () => void
}

const AiAnalysisDialog = ({ mutateHistory }: Props) => {
  const [curStep, setCurStep] = useState(1)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const { isOpenAiAnalysisDialog, closeAiAnalysisDialog, aiAnalysisPatientId } = useStore(patientPageStore)
  const { openSnackbar } = useContext(SnackbarContext)
  const { data: cbctRecord, mutate } = useSWR(
    aiAnalysisPatientId ? `cbct/records/${aiAnalysisPatientId}` : null,
    async () => cbctRecordApi.getRecords(aiAnalysisPatientId || '')
      .then(res => res.map((record) => ({
        id: record.id,
        date: record.date,
        images: record.images.map((image) => ({
          id: image.id,
          url: convertToProxyUrl(image.url),
          name: image.name
        })),
        views: []
      })))
  )
  const handleUploadFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    const invalidFiles = findInvalidFiles(files, FileTypes.CBCT)

    if (invalidFiles.length > 0) {
      setIsErrorDialogOpen(true)
      return
    }

    if (files && files.length > 0) {
      setIsUploading(true)
      setUploadProgress(0)
      await cbctRecordApi.create({
        patientId: aiAnalysisPatientId || '',
        images: Array.from(files || [])
      }, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          )
          setUploadProgress(percentCompleted)
        }
      })
        .then(() => {
          openSnackbar({
            severity: 'success',
            message: 'Uploaded successfully'
          })
          mutate()
        })
        .catch(() => {
          openSnackbar({
            severity: 'error',
            message: 'Upload failed'
          })
        })
        .finally(() => {
          setIsUploading(false)
        })

    }
  }

  const handleDeleteImage = (id: uuid) => {
    cbctImageApi.delete(id)
      .then(() => {
        openSnackbar({
          severity: 'success',
          message: 'Delete successfully'
        })
        mutate()
      })
      .catch(() => {
        openSnackbar({
          severity: 'error',
          message: 'Delete failed'
        })
      })
  }

  const toolbar = <Box
    sx={{
      height: 42,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center'
    }}
  >
    <Button variant={'primary'} component={'label'}>
      Select More Photos
      <Input
        className={'visually-hidden'}
        type={'file'}
        inputProps={{
          multiple: true,
          accept: '.dcm'
        }}
        onChange={handleUploadFiles}
      />
    </Button>
  </Box>

  const form = useForm<CreateRequest>({
    resolver: zodResolver(createRequestBodySchema)
  })

  const handleSelectCBCTRecord = (id: uuid) => {
    if (form.getValues('recordId') === id) {
      form.setValue('recordId', undefined as unknown as uuid)
    } else {
      form.setValue('recordId', id)
    }
  }

  const onSubmit = (data: CreateRequest) => {
    cbctAiOutputApi.create(data)
      .then(() => {
        setCurStep(3)
      })
      .catch(() => {
        openSnackbar({
          message: 'Network error',
          severity: 'error'
        })
      })
  }

  const handleNextClick = async () => {
    switch (curStep) {
    case 1:
      setCurStep(2)
      break
    case 2:
      form.handleSubmit(onSubmit)()
      break
    }
  }

  const models = [{
    label: 'CBCT Phenotype分析',
    value: CbctAiModel.CBCT_OSA_RISK
  }]

  useEffect(() => {
    if (isOpenAiAnalysisDialog) {
      setCurStep(1)
      form.reset()
    }
    mutate()
  }, [isOpenAiAnalysisDialog])

  useEffect(() => {
  }, [form.watch('model'), form.watch('recordId')])

  const isAllImagesEmpty = cbctRecord?.every(record => record.images.length === 0)
  const hasImages = cbctRecord && cbctRecord.length > 0 && !isAllImagesEmpty

  return (
    <>
      <Dialog
        open={isOpenAiAnalysisDialog}
        onClose={(_, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return
          }
          closeAiAnalysisDialog()
        }}
        PaperProps={{
          sx: {
            width: '800px',
            height: '600px',
            maxWidth: '800px',
            maxHeight: '600px',
            borderRadius: '10px'
          }
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
          AI Analysis
        </DialogTitle>
        <IconButton
          aria-label={'close'}
          onClick={() => closeAiAnalysisDialog()}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500]
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '70vh',
            px: 4,
            pb: 3,
            pt: 0
          }}>
          {(() => {
            switch (curStep) {
            case 1:
              return (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <Typography sx={{
                    mt: 7,
                    fontSize: 18,
                    fontStyle: 'normal',
                    fontWeight: 600
                  }}>選擇你想要使用的 AI 分析</Typography>
                  <Box sx={{
                    display: 'flex',
                    gap: 4
                  }}>
                    {models.map((model) => (
                      <Box key={model.value}>
                        <Box
                          sx={{
                            position: 'relative',
                            width: 216,
                            height: 216,
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            form.setValue('model', form.getValues('model') === model.value ? undefined as unknown as CbctAiModel : model.value)
                          }}
                        >
                          <Image
                            src={cbctOSA}
                            alt={'cbct-osa'}
                            fill
                          />
                          <BlackBorderCheckbox
                            checked={form.getValues('model') === model.value}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0
                            }}
                          />
                        </Box>
                        <Typography sx={{
                          mt: 2,
                          fontSize: 22,
                          fontStyle: 'normal',
                          fontWeight: 600,
                          textAlign: 'center'
                        }}>{model.label}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )
            case 2:
              return isUploading ? (
                <UploadProgress progress={uploadProgress} />
              ) : (
                hasImages ? (
                  <Box sx={{
                    width: '100%',
                    height: '100%',
                    p: 1,
                    borderRadius: '8px',
                    background: '#E5E5E5'
                  }}>
                    <DCMPreviewBox
                      images={cbctRecord}
                      deleteImage={handleDeleteImage}
                      toolbar={toolbar}
                      needSelect={true}
                      onSelect={handleSelectCBCTRecord}
                      selectedId={form.getValues('recordId')}
                      viewType={'grid'}
                    />
                  </Box>
                ) : (
                  <ImageUploadBox variant={'edit'} sx={{ height: '100%' }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Image
                        src={UploadPatient}
                        alt={'upload'}
                        width={250}
                        height={250}
                      />
                      <Typography sx={{ fontSize: 14, fontStyle: 'normal', fontWeight: 400, mb: 1.25 }}>尚未上傳任何照片</Typography>
                      <Button variant={'primary'} component={'label'}>
                        前往新增照片
                        <Input
                          className={'visually-hidden'}
                          type={'file'}
                          inputProps={{
                            accept: '.dcm',
                            multiple: true
                          }}
                          onChange={handleUploadFiles}
                        />
                      </Button>
                    </Box>
                  </ImageUploadBox>
                )
              )
            case 3:
              return (
                <>
                  <AiAnalysisResult recordId={form.getValues('recordId') || ''} mutateHistory={mutateHistory} />
                </>
              )
            }
          })()}
        </DialogContent>
        {(curStep === 1 || curStep === 2) && (
          <DialogActions>
            <Button
              variant={'primary'}
              onClick={handleNextClick}
              disabled={
                curStep === 1 && !form.getValues('model') ||
                curStep === 2 && !form.getValues('recordId')
              }
            >
              {curStep === 1 ? 'START' : 'NEXT'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
      <ImageUploadErrorDialog
        open={isErrorDialogOpen}
        onClose={() => setIsErrorDialogOpen(false)}
      />
    </>
  )
}

export default AiAnalysisDialog
