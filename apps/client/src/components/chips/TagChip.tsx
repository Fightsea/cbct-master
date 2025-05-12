import { Box, Menu, SxProps, MenuItem, Typography, Dialog, Grid2, DialogContent, DialogTitle, DialogActions, Button } from '@mui/material'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import CreateRoundedIcon from '@mui/icons-material/CreateRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { useStore } from 'zustand'
import { useContext, useEffect, useState } from 'react'
import { globalStore } from '@/stores/globalStore'
import tagApi from '@/apis/tagApi'
import FormColorPicker from '../forms/FormColorPicker'
import FilledFormInput from '../forms/FilledFormInput'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateRequest, updateRequestBodySchema } from '@cbct/api/request/tag'
import { SnackbarContext } from '@/contexts/SnackbarContext'

type Props = {
  id?: string
  label: string
  color: string
  sx?: SxProps
  onRemove?: (event: any) => void
  mutateTags?: () => void
}

const TagChip = ({
  id,
  color,
  label,
  sx,
  onRemove,
  mutateTags
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { openDeleteDialog } = useStore(globalStore)
  const { openSnackbar } = useContext(SnackbarContext)

  const form = useForm<UpdateRequest>({
    resolver: zodResolver(updateRequestBodySchema)
  })

  const onSubmit = async (data: UpdateRequest) => {
    try {
      if (id) {
        await tagApi.update(id, data)
          .then(() => {
            mutateTags?.()
            setIsDialogOpen(false)
            openSnackbar({
              message: 'Update tag success',
              severity: 'success'
            })
          })
        form.reset()
      }
    } catch {
      openSnackbar({
        message: 'Update failed',
        severity: 'error'
      })
    }
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setOpenMenuId(null)
  }

  const checkColorIsDark = (bgColor: string) => {
    const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor
    const r = parseInt(color.substring(0, 2), 16)
    const g = parseInt(color.substring(2, 4), 16)
    const b = parseInt(color.substring(4, 6), 16)
    return ((r * 0.299) + (g * 0.587) + (b * 0.114)) <= 186
  }

  useEffect(() => {
    form.setValue('name', label)
    form.setValue('color', color)
  }, [isDialogOpen])

  return (
    <>
      <Box
        sx={{
          color: checkColorIsDark(color) ? '#fff' : '#000',
          backgroundColor: color,
          height: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 0.75,
          py: '0.5px',
          borderRadius: 1,
          fontSize: 10,
          fontFamily: 'Roboto',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '150%',
          ...sx
        }}
      >
        {label}
        {onRemove && id && (
          <>
            <MoreVertRoundedIcon
              onClick={(event) => {
                setAnchorEl(event.currentTarget)
                setOpenMenuId(id)
              }}
              sx={{
                fontSize: (sx as any)?.fontSize || 8,
                cursor: 'pointer'
              }}
            />
            <Menu
              id={`menu-${id}`}
              anchorEl={anchorEl}
              keepMounted
              open={openMenuId === id}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={(event) => {
                  onRemove(event)
                  handleMenuClose()
                }}
                sx={{ color: 'red' }}
              >
                <ClearRoundedIcon sx={{ mr: 1 }} />
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Remove</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setIsDialogOpen(true)
                  handleMenuClose()
                }}
              >
                <CreateRoundedIcon sx={{ mr: 1 }} />
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Edit</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  openDeleteDialog(() => {
                    tagApi.delete(id)
                      .then(() => {
                        mutateTags?.()
                        handleMenuClose()
                      })
                  })
                }}
                sx={{ color: 'red' }}
              >
                <DeleteRoundedIcon sx={{ mr: 1 }} />
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Delete</Typography>
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>

      <Dialog
        open={isDialogOpen}
        onClose={(_, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return
          }
          setIsDialogOpen(false)
        }}
        onKeyDown={(event) => {
          event.stopPropagation()
        }}
      >
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogTitle>Edit tag</DialogTitle>
            <DialogContent>
              <Grid2 container spacing={2}>
                <Grid2 size={12}>
                  <FilledFormInput
                    name={'name'}
                    label={'Name'}
                    required
                    fullWidth
                  />
                </Grid2>
                <Grid2 size={12}>
                  <FormColorPicker
                    name={'color'}
                    label={'Color'}
                    value={form.getValues('color')}
                    required
                    fullWidth
                  />
                </Grid2>
              </Grid2>
            </DialogContent>
            <DialogActions>
              <Button variant={'secondary'} onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button variant={'primary'} onClick={() => form.handleSubmit(onSubmit)()}>Edit</Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>
    </>
  )
}

export default TagChip
