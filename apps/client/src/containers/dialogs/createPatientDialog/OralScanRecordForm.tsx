import { createRequestBodySchema, type CreateRequest } from '@/types/oralScanRecord'
import ImageUploadBox from '@/components/boxes/ImageUploadBox'
import { Button, Input } from '@mui/material'
import { Box } from '@mui/material'
import { Grid2, Typography } from '@mui/material'
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import UploadPatient from '@/public/upload-patient.png'
import FilePreviewBox, { type FileType } from '@/components/boxes/FilePreviewBox'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { useStore } from 'zustand'
import { createPatientDialogStore } from '@/stores/createPatientDialogStore'
import { SnackbarContext } from '@/contexts/SnackbarContext'
import { useContext } from 'react'
import { FileTypes, findInvalidFiles } from '@/utils/fileValidator'
import ImageUploadErrorDialog from '@/containers/dialogs/ImageUploadErrorDialog'

type Props = {
  onSubmit: (data: CreateRequest) => void
}

type ExtendedFileType = FileType & {
  file: File
}

export type OralScanRecordFormHandle = {
  handleSubmit: () => Promise<void>
}

const OralScanRecordForm = forwardRef<OralScanRecordFormHandle, Props>(({ onSubmit }, ref) => {
  const [files, setFiles] = useState<ExtendedFileType[]>([])
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const { patientId, stepsStates, setStepValid } = useStore(createPatientDialogStore)
  const { openSnackbar } = useContext(SnackbarContext)
  const form = useForm<CreateRequest>({
    resolver: zodResolver(createRequestBodySchema),
    defaultValues: {
      patientId: patientId || undefined,
      files: []
    }
  })

  const handleUploadFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    let existDuplicate = false
    if (!event.target.files || event.target.files.length === 0) return
    const invalidFiles = findInvalidFiles(event.target.files, FileTypes.ORAL_SCAN)

    if (invalidFiles.length > 0) {
      setIsErrorDialogOpen(true)
      return
    }

    const newFiles = Array.from(event.target.files)
      .filter(file => {
        if (files.some(f => f.file.name === file.name)) {
          existDuplicate = true
          return false
        }
        return true
      })
      .map(file => ({ id: uuidv4(), file, name: file.name }))

    if (existDuplicate) {
      openSnackbar({
        message: 'Automatically remove duplicate files',
        severity: 'warning'
      })
    }

    setFiles([...files, ...newFiles])
  }

  const handleDeleteImage = (id: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== id))
  }

  const toolBar = <Box
    sx={{
      height: 42,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center'
    }}
  >
    <Button variant={'primary'} component={'label'}>
      Select More Files
      <Input
        className={'visually-hidden'}
        type={'file'}
        inputProps={{
          multiple: true,
          accept: '.stl'
        }}
        onChange={handleUploadFiles}
      />
    </Button>
  </Box>

  const formFiles = form.watch('files')
  useEffect(() => {
    if (formFiles.length > 0) {
      setStepValid(5, true)
    } else {
      setStepValid(5, false)
    }
  }, [formFiles])

  useEffect(() => {
    form.setValue('files', files.map(file => file.file))
  }, [files])

  useImperativeHandle(ref, () => ({
    handleSubmit: async () => {
      await form.handleSubmit(onSubmit)()
    }
  }))

  return (
    <Grid2
      component={'form'}
      onSubmit={form.handleSubmit(onSubmit)}
      container
      spacing={1.5}
      sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      <Grid2 size={12}>
        <Typography sx={{ fontSize: 22, fontStyle: 'normal', fontWeight: 600 }}>Oral Scan</Typography>
      </Grid2>
      <Grid2 size={12} sx={{ flex: 1 }}>
        {stepsStates[4].isValid ? (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              border: '1px solid #E5E5E5',
              background: '#F3F3F3',
              height: '100%'
            }}
          >
            <FilePreviewBox
              files={[{ date: dayjs().format('YYYY-MM-DD'), files: files.map(file => ({ id: file.id, name: file.file.name })) }]}
              deleteFile={handleDeleteImage}
              toolbar={toolBar}
            />
          </Box>
        ) : (
          <ImageUploadBox>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed #C6CAE2'
              }}
            >
              <Image
                src={UploadPatient}
                alt={'upload'}
                width={250}
                height={250}
              />
              <Box
                sx={{ width: '230px' }}
              >
                <Button variant={'primary'} component={'label'} sx={{ width: '125px', mx: 'auto', textWrap: 'nowrap'}}>
                  Select Photos
                  <Input
                    className={'visually-hidden'}
                    type={'file'}
                    inputProps={{
                      accept: '.stl',
                      multiple: true
                    }}
                    onChange={handleUploadFiles}
                  />
                </Button>
                <Typography align={'center'} color={'#262626'} sx={{ fontSize: 14, my: 1.25 }}>Drag and drop .stl files to upload</Typography>
                <Typography align={'center'} color={'#656565'} sx={{ fontFamily: 'Roboto', fontSize: 12 }}>File types: .stl</Typography>
              </Box>
            </Box>
          </ImageUploadBox>
        )}
      </Grid2>
      <ImageUploadErrorDialog
        open={isErrorDialogOpen}
        onClose={() => setIsErrorDialogOpen(false)}
      />
    </Grid2>
  )
})

export default OralScanRecordForm
OralScanRecordForm.displayName = 'OralScanRecordForm'

