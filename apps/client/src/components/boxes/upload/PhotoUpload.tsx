import { Box, Button, Input, Typography } from '@mui/material'
import Image from 'next/image'
import UploadPatient from '@/public/upload-patient.png'
import ImageUploadBox from '@/components/boxes/ImageUploadBox'
import { ChangeEvent } from 'react'
import UploadProgress from '@/components/progress/UploadProgress'

type PhotoUploadBoxProps = {
  isUploading: boolean
  progress: number
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
}

const PhotoUpload = ({
  isUploading,
  progress,
  onUpload
}: PhotoUploadBoxProps) => {

  if (isUploading) {

    return (
      <UploadProgress progress={progress} />
    )
  }

  return (
    <>
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
            <Button variant={'primary'} component={'label'} sx={{ width: '125px', mx: 'auto', textWrap: 'nowrap' }}>
                Select Photos
              <Input
                className={'visually-hidden'}
                type={'file'}
                inputProps={{
                  accept: '.jpg,.jpeg,.png',
                  multiple: true
                }}
                onChange={onUpload}
              />
            </Button>
            <Typography align={'center'} color={'#262626'} sx={{ fontSize: 14, my: 1.25 }}>Drag and drop photos to upload</Typography>
            <Typography align={'center'} color={'#656565'} sx={{ fontFamily: 'Roboto', fontSize: 12 }}>File types: .jpg, .jpeg, .png</Typography>
          </Box>
        </Box>
      </ImageUploadBox>
    </>
  )
}

export default PhotoUpload
