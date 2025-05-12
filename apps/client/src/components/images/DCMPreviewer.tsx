import { Box, IconButton } from '@mui/material'
import { useStore } from 'zustand'
import { globalStore } from '@/stores/globalStore'
import CloseIcon from '@mui/icons-material/Close'
import dynamic from 'next/dynamic'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

const DicomViewer = dynamic(() => import('@/components/images/DCMViewer'), { ssr: false })

const DCMPreviewer = () => {
  const { dcmUrls, dcmIndex, closeDcmPreview, nextDcm, prevDcm } = useStore(globalStore)

  if (!dcmUrls.length) return null

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
      onClick={closeDcmPreview}
    >
      <IconButton
        onClick={(e) => {
          e.stopPropagation()
          closeDcmPreview()
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
            prevDcm()
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
          <DicomViewer
            dicomUrl={dcmUrls[dcmIndex]}
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              maxHeight: '95vh',
              maxWidth: '95vw',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </Box>

        <IconButton
          onClick={(e) => {
            e.stopPropagation()
            nextDcm()
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

export default DCMPreviewer
