import { createRequestBodySchema, type CreateRequest } from '@/types/xrayRecord'
import ImageUploadBox from '@/components/boxes/ImageUploadBox'
import { Button, Input } from '@mui/material'
import { Box } from '@mui/material'
import { Grid2, Typography } from '@mui/material'
import { ChangeEvent, forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import UploadPatient from '@/public/upload-patient.png'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import ImagePreviewBox, { ImageType } from '@/components/boxes/ImagePreviewBox'
import { useStore } from 'zustand'
import { createPatientDialogStore } from '@/stores/createPatientDialogStore'
import XRayPhotos from '../patientDetailDialog/XRayPhotos'
import { SnackbarContext } from '@/contexts/SnackbarContext'
import { FileTypes, findInvalidFiles } from '@/utils/fileValidator'
import ImageUploadErrorDialog from '@/containers/dialogs/ImageUploadErrorDialog'

type Props = {
  onSubmit: (data: CreateRequest) => void
}

type ExtendedImageType = ImageType & {
  file: File
}

export type XRayRecordFormHandle = {
  handleSubmit: () => Promise<void>
}

const XRayRecordForm = forwardRef<XRayRecordFormHandle, Props>(({ onSubmit }, ref) => {
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
    const invalidFiles = findInvalidFiles(event.target.files, FileTypes.XRAY)

    if (invalidFiles.length > 0) {
      setIsErrorDialogOpen(true)
      return
    }

    const newImages = Array.from(event.target.files)
      .filter(file => {
        if (images.some(f => f.file.name === file.name)) {
          existDuplicate = true
          return false
        }
        return true
      })
      .map(file => ({
        id: uuidv4(),
        imageUrl: URL.createObjectURL(file),
        file
      }))

    if (existDuplicate) {
      openSnackbar({
        message: 'Automatically remove duplicate files',
        severity: 'warning'
      })
    }

    setImages([...images, ...newImages])
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
          accept: '.jpg,.jpeg'
        }}
        onChange={handleUploadFiles}
      />
    </Button>
  </Box>

  const formImages = form.watch('images')
  useEffect(() => {
    if (stepsStates[3].isUploaded) {
      setStepValid(4, true)
      return
    }

    if (formImages.length > 0) {
      setStepValid(4, true)
    } else {
      setStepValid(4, false)
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
        <Typography sx={{ fontSize: 22, fontStyle: 'normal', fontWeight: 600 }}>X-Ray</Typography>
      </Grid2>
      <Grid2 size={12} sx={{ flex: 1 }}>
        {stepsStates[3].isUploaded ? (
          <XRayPhotos />
        ) : stepsStates[3].isValid ? (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              border: '1px solid #E5E5E5',
              background: '#F3F3F3',
              height: '100%'
            }}
          >
            <ImagePreviewBox
              images={[{ date: dayjs().format('YYYY-MM-DD'), images: images.map(image => ({ id: image.id, imageUrl: image.imageUrl })) }]}
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
                      accept: '.jpg,.jpeg',
                      multiple: true
                    }}
                    onChange={handleUploadFiles}
                  />
                </Button>
                <Typography align={'center'} color={'#262626'} sx={{ fontSize: 14, my: 1.25 }}>Drag and drop files to upload</Typography>
                <Typography align={'center'} color={'#656565'} sx={{ fontFamily: 'Roboto', fontSize: 12 }}>File types: .jpg, .jpeg</Typography>
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

export default XRayRecordForm
XRayRecordForm.displayName = 'XRayRecordForm'

