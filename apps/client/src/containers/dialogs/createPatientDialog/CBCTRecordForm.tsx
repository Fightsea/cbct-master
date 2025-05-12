import { createRequestBodySchema, type CreateRequest } from '@/types/cbctRecord'
import ImageUploadBox from '@/components/boxes/ImageUploadBox'
import { Button, Input } from '@mui/material'
import { Box } from '@mui/material'
import { Grid2, Typography } from '@mui/material'
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import UploadPatient from '@/public/upload-patient.png'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { useStore } from 'zustand'
import dynamic from 'next/dynamic'
import { ImageType } from '@/components/boxes/DCMPreviewBox'
import { createPatientDialogStore } from '@/stores/createPatientDialogStore'
import CBCTPhotos from '../patientDetailDialog/CBCTPhotos'
import { SnackbarContext } from '@/contexts/SnackbarContext'
import { useContext } from 'react'
import { FileTypes, findInvalidFiles } from '@/utils/fileValidator'
import ImageUploadErrorDialog from '@/containers/dialogs/ImageUploadErrorDialog'

const DCMPreviewBox = dynamic(() => import('@/components/boxes/DCMPreviewBox'), { ssr: false })

type Props = {
  onSubmit: (data: CreateRequest) => void
}

type ExtendedImageType = ImageType & {
  file: File
}

export type CBCTRecordFormHandle = {
  handleSubmit: () => Promise<void>
}

const CBCTRecordForm = forwardRef<CBCTRecordFormHandle, Props>(({ onSubmit }, ref) => {
  const [images, setImages] = useState<ExtendedImageType[]>([])
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const { stepsStates, setStepValid, patientId } = useStore(createPatientDialogStore)
  const { openSnackbar } = useContext(SnackbarContext)

  const form = useForm<CreateRequest>({
    resolver: zodResolver(createRequestBodySchema),
    defaultValues: {
      patientId: patientId || undefined,
      images: []
    }
  })

  const handleUploadFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    let existDuplicate = false
    if (!event.target.files || event.target.files.length === 0) return
    const invalidFiles = findInvalidFiles(event.target.files, FileTypes.CBCT)

    if (invalidFiles.length > 0) {
      setIsErrorDialogOpen(true)
      return
    }

    const newFiles = Array.from(event.target.files)
      .filter(file => {
        if (images.some(f => f.file.name === file.name)) {
          existDuplicate = true
          return false
        }
        return true
      })
      .map(file => ({
        id: uuidv4(),
        url: URL.createObjectURL(file),
        file,
        name: file.name
      }))

    if (existDuplicate) {
      openSnackbar({
        message: 'Automatically remove duplicate files',
        severity: 'warning'
      })
    }

    setImages([...images, ...newFiles])
  }

  const handleDeleteImage = (id: string) => {
    setImages(prevImages => prevImages.filter(image => image.id !== id))
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

  const formImages = form.watch('images')
  useEffect(() => {
    if (stepsStates[2].isUploaded) {
      setStepValid(3, true)
      return
    }

    if (formImages.length > 0) {
      setStepValid(3, true)
    } else {
      setStepValid(3, false)
    }
  }, [formImages])

  useEffect(() => {
    form.setValue('images', images.map(image => image.file))
  }, [images])

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
        <Typography sx={{ fontSize: 22, fontStyle: 'normal', fontWeight: 600 }}>CBCT</Typography>
      </Grid2>
      <Grid2 size={12} sx={{ flex: 1 }}>
        {stepsStates[2].isUploaded ? (
          <CBCTPhotos />
        ) : stepsStates[2].isValid ? (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              border: '1px solid #E5E5E5',
              background: '#F3F3F3',
              height: '100%'
            }}
          >
            <DCMPreviewBox
              images={[{
                id: uuidv4(),
                date: dayjs().format('YYYY-MM-DD'),
                images: images.map(image => ({ id: image.id, url: URL.createObjectURL(image.file), name: image.name })),
                views: []
              }]}
              deleteImage={handleDeleteImage}
              toolbar={toolBar}
              viewType={'grid'}
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
                      accept: '.dcm',
                      multiple: true
                    }}
                    onChange={handleUploadFiles}
                  />
                </Button>
                <Typography align={'center'} color={'#262626'} sx={{ fontSize: 14, my: 1.25 }}>Drag and drop .DCM files to upload</Typography>
                <Typography align={'center'} color={'#656565'} sx={{ fontFamily: 'Roboto', fontSize: 12 }}>File types: .DCM</Typography>
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

export default CBCTRecordForm
CBCTRecordForm.displayName = 'CBCTRecordForm'

