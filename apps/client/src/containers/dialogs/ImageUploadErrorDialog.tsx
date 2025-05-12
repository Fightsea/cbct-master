import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

type Props = {
  open: boolean
  onClose: () => void
}

const ImageUploadErrorDialog = ({ open, onClose }: Props) => {
  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return
        }
        onClose()
      }}
      disableEscapeKeyDown
      aria-labelledby={'alert-dialog-title'}
      aria-describedby={'alert-dialog-description'}
      PaperProps={{
        sx: {
          width: '600px',
          filter: 'drop-shadow(0px 50px 50px rgba(110, 122, 139, 0.5))',
          mixBlendMode: 'multiply',
          borderRadius: '16px'
        }
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'transparent'
        }
      }}
    >
      <DialogTitle id={'alert-dialog-title'} bgcolor={'rgba(110, 122, 184, 0.1)'} height={'64px'}>
        <Typography variant={'h3'} align={'center'} color={'#262626'}>Error</Typography>
      </DialogTitle>
      <Box
        sx={{
          height: '1px',
          background: 'linear-gradient(90deg, rgba(110, 122, 184, 0) 0%, rgba(110, 122, 184, 1) 50%, rgba(110, 122, 184, 0) 100%)'
        }}
      />
      <IconButton
        aria-label={'close'}
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 14
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ bgcolor: 'rgba(110, 122, 184, 0.1)' }}>
        <DialogContentText id={'alert-dialog-description'} height={'128px'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Typography
            sx={{
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '150%',
              color: '#262626'
            }}
          >檔案格式不支援</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ bgcolor: 'rgba(110, 122, 184, 0.1)', padding: '24px 0 32px' }}>
        <Button onClick={onClose} autoFocus color={'primary'} variant={'contained'} sx={{ width: '120px', height: '48px', mx: 'auto', borderRadius: '8px' }}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImageUploadErrorDialog
