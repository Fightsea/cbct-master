import { Box, IconButton } from '@mui/material'
import { useStore } from 'zustand'
import { globalStore } from '@/stores/globalStore'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

const ImagePreviewer = () => {
  const { imageUrls, imageIndex, closeImagePreview, nextImage, prevImage } = useStore(globalStore)

  if (!imageUrls.length) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 1)',
        zIndex: 5000,
        padding: 2,
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={closeImagePreview}
    >
      <IconButton
        onClick={(e) => {
          e.stopPropagation()
          closeImagePreview()
        }}
        sx={{
          alignSelf: 'flex-end',
          color: 'white',
          mb: 1
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <IconButton
          onClick={(e) => {
            e.stopPropagation()
            prevImage()
          }}
          sx={{
            color: 'white',
            height: '100%',
            borderRadius: 0
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <Box
          sx={{
            flex: 1,
            height: '85vh',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={imageUrls[imageIndex]}
            alt={imageUrls[imageIndex]}
            fill
            style={{
              objectFit: 'contain',
              maxHeight: '95vh',
              maxWidth: '95vw',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            priority
          />
        </Box>

        <IconButton
          onClick={(e) => {
            e.stopPropagation()
            nextImage()
          }}
          sx={{
            color: 'white',
            height: '100%',
            borderRadius: 0
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default ImagePreviewer
