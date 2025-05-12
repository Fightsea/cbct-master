import { Button, Dialog, DialogTitle, DialogActions, DialogContent, Typography, IconButton } from '@mui/material'
import { useStore } from 'zustand'
import { globalStore } from '@/stores/globalStore'
import Image from 'next/image'
import deleteConfirmImage from '@/public/delete-confirm.png'
import CloseIcon from '@mui/icons-material/Close'
const DeleteConfirmDialog = () => {
  const { isOpen, handleDelete, closeDeleteDialog } = useStore(globalStore)

  return (
    <Dialog
      sx={{ '& .MuiPaper-root': { borderRadius: 4 } }}
      open={isOpen}
      fullWidth
      maxWidth={'sm'}
      onClose={(_, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return
        }
        closeDeleteDialog()
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 64,
        px: 3,
        py: 1.5,
        fontSize: 22,
        fontStyle: 'normal',
        fontWeight: 700,
        background: 'rgba(110, 122, 184, 0.2)',
        borderBottom: '2px solid rgba(110, 122, 184, 0.8)'
      }}>
        刪除？
      </DialogTitle>
      <IconButton
        aria-label={'close'}
        onClick={closeDeleteDialog}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500]
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'rgba(110, 122, 184, 0.2)'
      }}>
        <Image src={deleteConfirmImage} alt={'delete'} width={200} height={200} />
        <Typography sx={{
          fontStyle: 'normal',
          fontWeight: 600,
          fontSize: 16,
          color: '#262626'
        }}>
          您確定要刪除嗎？
        </Typography>
      </DialogContent>
      <DialogActions sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(110, 122, 184, 0.2)',
        pb: 4
      }}>
        <Button
          variant={'primary'}
          onClick={handleDelete}
          sx={{
            px: 5,
            py: 2.5
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmDialog
