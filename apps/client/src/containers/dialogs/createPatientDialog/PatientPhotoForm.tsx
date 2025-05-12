import { forwardRef, useContext, useEffect, useImperativeHandle } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Grid2, Input, Typography } from '@mui/material'
import Image from 'next/image'
import { type ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import UploadPatient from '@/public/upload-patient.png'
import PatientPhotoBox from '@/components/boxes/PatientPhotoBox'
import ImageUploadBox from '@/components/boxes/ImageUploadBox'
import { v4 as uuidv4 } from 'uuid'
import { uploadRequestSchema, type UploadRequest } from '@/types/patientPhoto'
import dayjs from 'dayjs'
import { useStore } from 'zustand'
import { createPatientDialogStore } from '@/stores/createPatientDialogStore'
import PatientPhoto from '../patientDetailDialog/PatientPhoto'
import { SnackbarContext } from '@/contexts/SnackbarContext'
import { FileTypes, findInvalidFiles } from '@/utils/fileValidator'
import ImageUploadErrorDialog from '@/containers/dialogs/ImageUploadErrorDialog'

type Props = {
  onSubmit: (data: UploadRequest) => void
  isUploading: boolean
  progress: number
}

type ImageType = {
  id: string
  imageUrl: string
  file: File
}

export type PatientPhotoFormHandle = {
  handleSubmit: () => Promise<void>
}

const PatientPhotoForm = forwardRef<PatientPhotoFormHandle, Props>(({ onSubmit, isUploading, progress }, ref) => {
  const [images, setImages] = useState<ImageType[]>([])
  const [frontImageId, setFrontImageId] = useState<string | null>(null)
  const [profileImageId, setProfileImageId] = useState<string | null>(null)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const { stepsStates, setStepValid, patientId } = useStore(createPatientDialogStore)
  const { openSnackbar } = useContext(SnackbarContext)

  const form = useForm<UploadRequest>({
    resolver: zodResolver(uploadRequestSchema),
    defaultValues: {
      patientId: patientId || undefined,
      images: []
    }
  })

  const handleSetFrontImage = (id: string) => {
    form.setValue('frontFileName', images.find(image => image.id === id)?.file.name)
    setFrontImageId(id)
  }

  const handleSetProfileImage = (id: string) => {
    form.setValue('profileFileName', images.find(image => image.id === id)?.file.name)
    setProfileImageId(id)
  }

  useImperativeHandle(ref, () => ({
    handleSubmit: async () => {
      await form.handleSubmit(onSubmit)()
    }
  }))

  const handleUploadFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    let existDuplicate = false
    if (!event.target.files || event.target.files.length === 0) return
    const invalidFiles = findInvalidFiles(event.target.files, FileTypes.PHOTO)

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
        imageUrl: URL.createObjectURL(file),
        file
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

    if (frontImageId === id) {
      form.setValue('frontFileName', undefined)
      setFrontImageId(null)
    }
    if (profileImageId === id) {
      form.setValue('profileFileName', undefined)
      setProfileImageId(null)
    }
  }

  const formImages = form.watch('images')
  useEffect(() => {
    if (stepsStates[1].isUploaded) {
      setStepValid(2, true)
      return
    }

    if (formImages.length > 0) {
      setStepValid(2, true)
    } else {
      setStepValid(2, false)
    }
  }, [formImages])

  useEffect(() => {
    form.setValue('images', images.map(image => image.file))
  }, [images])

  return (
    <Grid2
      component={'form'}
      onSubmit={form.handleSubmit(onSubmit)}
      container
      spacing={1.5}
      sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      <Grid2 size={12}>
        <Typography sx={{ fontSize: 22, fontStyle: 'normal', fontWeight: 600 }}>Photos 頭像與AI分析使用</Typography>
      </Grid2>
      <Grid2 size={12} sx={{ flex: 1 }}>
        {stepsStates[1].isUploaded ? (
          <PatientPhoto />
        ) : stepsStates[1].isValid ? (
          <PatientPhotoBox
            isUploading={isUploading}
            uploadProgress={progress}
            frontImageId={frontImageId}
            profileImageId={profileImageId}
            images={[{ date: dayjs().format('YYYY-MM-DD'), images: images }]}
            setFrontImage={handleSetFrontImage}
            setProfileImage={handleSetProfileImage}
            deleteImage={handleDeleteImage}
            handleUploadFiles={handleUploadFiles}
          />
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
                      accept: '.jpg,.jpeg,.png',
                      multiple: true
                    }}
                    onChange={handleUploadFiles}
                  />
                </Button>
                <Typography align={'center'} color={'#262626'} sx={{ fontSize: 14, my: 1.25 }}>Drag and drop photos to upload</Typography>
                <Typography align={'center'} color={'#656565'} sx={{ fontFamily: 'Roboto', fontSize: 12 }}>File types: .jpg, .jpeg, .png</Typography>
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

PatientPhotoForm.displayName = 'PatientPhotoForm'
export default PatientPhotoForm
