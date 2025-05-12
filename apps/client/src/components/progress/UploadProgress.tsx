import { Box, LinearProgress, Typography } from '@mui/material'
import Image from 'next/image'
import PhotoUploadImg from '@/public/photo_upload-img.png'

type UploadProgressProps = {
  progress: number
}

const UploadProgress = ({ progress }: UploadProgressProps) => {

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          padding: '8px',
          border: '2px solid #9EA5C7',
          borderRadius: '10px',
          backgroundColor: '#E9EBF4'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.25, height: '100%', border: '1px dashed #C6CAE2', p: 2 }}>
          <Box sx={{ width: '100%', maxWidth: '250px', height: '100%', maxHeight: '250px', position: 'relative' }}>
            <Image
              src={PhotoUploadImg}
              alt={'upload'}
              fill
              style={{
                position: 'absolute',
                objectFit: 'contain'
              }}
            />
          </Box>
          <Box sx={{ width: '100%', maxWidth: '360px' }}>
            <LinearProgress variant={'determinate'} value={progress} sx={{ borderRadius: '10px', height: '3px', bgcolor: 'rgba(0, 0, 0, 0.8)' }} />
          </Box>
          <Typography color={'#5664AA'} sx={{ fontSize: 12, fontFamily: 'Roboto', lineHeight: '150%' }}>Uploading...{progress}%</Typography>
        </Box>
      </Box>
    </>
  )
}

export default UploadProgress
