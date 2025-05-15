import ImageUploadBox from '@/components/boxes/ImageUploadBox'
import { SnackbarContext } from '@/contexts/SnackbarContext'
import { patientPageStore } from '@/stores/patientPageStore'
import { Box, Button, ButtonGroup, IconButton, Input, Typography } from '@mui/material'
import Image from 'next/image'
import { ChangeEvent, useContext, useState } from 'react'
import useSWR from 'swr'
import { useStore } from 'zustand'
import UploadPatient from '@/public/upload-patient.png'
import xrayRecordApi from '@/apis/xrayRecordApi'
import ImagePreviewBox from '@/components/boxes/ImagePreviewBox'
import xrayImageApi from '@/apis/xrayImageApi'
import { FileTypes, findInvalidFiles } from '@/utils/fileValidator'
import ImageUploadErrorDialog from '@/containers/dialogs/ImageUploadErrorDialog'
import UploadProgress from '@/components/progress/UploadProgress'
import FormSearchInput from '@/components/forms/FormSearchInput'
import CalendarIcon from '@/components/icons/CalendarIcon'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded'

type Props = {
  showViewToggle?: boolean
  showActions?: boolean
}

const XRayPhotos = ({
  showViewToggle = false,
  showActions = false
}: Props) => {
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const { patientId } = useStore(patientPageStore)
  const { data: xrayRecord, mutate } = useSWR(
    patientId ? `xray/records/${patientId}` : null,
    async () => xrayRecordApi.getRecords(patientId || '')
      .then(res => res.map((record) => ({
        date: record.date,
        images: record.images.map((image) => ({
          id: image.id,
          imageUrl: image.url,
          name: image.name
        }))
      })))
  )
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const { openSnackbar } = useContext(SnackbarContext)

  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid')

  const handleViewChange = (view: 'grid' | 'list') => {
    setActiveView(view)
  }

  const handleUploadFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    const invalidFiles = findInvalidFiles(files, FileTypes.XRAY)

    if (invalidFiles.length > 0) {
      setIsErrorDialogOpen(true)
      return
    }

    if (files && files.length > 0) {
      setIsUploading(true)
      setUploadProgress(0)
      xrayRecordApi.create({
        patientId: patientId || '',
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
          setUploadProgress(0)
        })
    }
  }

  const handleDeleteImage = (id: uuid) => {
    xrayImageApi.delete(id)
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

  const toolbar =(
    <Box
      sx={{
        height: 42,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5
      }}
    >
      {
        showViewToggle &&
        <>
          <ButtonGroup variant={'contained'} aria-label={'Basic button group'}>
            <Button
              onClick={() => handleViewChange('grid')}
              sx={{
                p: 1,
                bgcolor: activeView === 'grid' ? '#6E7AB8' : '#FAFAFA',
                color: activeView === 'grid' ? '#FFFFFF' : 'text.primary',
                '&:hover': {
                  bgcolor: '#F0F0F0'
                }
              }}
            >
              <GridViewOutlinedIcon />
            </Button>
            <Button
              onClick={() => handleViewChange('list')}
              sx={{
                p: 1,
                bgcolor: activeView === 'list' ? '#6E7AB8' : '#FAFAFA',
                color: activeView === 'list' ? '#FFFFFF' : 'text.primary',
                '&:hover': {
                  bgcolor: '#F0F0F0'
                }
              }}
            >
              <FormatListBulletedRoundedIcon />
            </Button>
          </ButtonGroup>
          <Box sx={{ width: '1px', height: '100%', backgroundColor: '#A1A1A1' }}></Box>
        </>
      }
      {
        showActions &&
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton sx={{ border: '0.5px solid #E9EBF4', borderRadius: '8px', backgroundColor: '#FAFAFA', '&:hover': { backgroundColor: '#E9EBF4', borderColor: '#C6CAE2' } }}>
            <CalendarIcon />
          </IconButton>
          <FormSearchInput
            value={''}
            onChange={() => {}}
          />
        </Box>
      }
      <Button variant={'primary'} component={'label'}  sx={{ ml: 'auto', textWrap: 'nowrap' }}>
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
  )

  const isAllImagesEmpty = xrayRecord?.every(record => record.images.length === 0)
  const hasImages = xrayRecord && xrayRecord.length > 0 && !isAllImagesEmpty

  return (
    <>
      {
        isUploading ?
          <UploadProgress progress={uploadProgress} /> :
          hasImages ? (
            <ImagePreviewBox
              images={xrayRecord || []}
              deleteImage={handleDeleteImage}
              toolbar={toolbar}
              viewType={activeView}
            />
          ) : (
            <ImageUploadBox variant={'edit'}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.25
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
          )
      }
      <ImageUploadErrorDialog
        open={isErrorDialogOpen}
        onClose={() => setIsErrorDialogOpen(false)}
      />
    </>
  )
}

export default XRayPhotos
