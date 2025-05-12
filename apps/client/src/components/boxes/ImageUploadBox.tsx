import { Box, type SxProps } from '@mui/material'
import { type ReactNode } from 'react'

type Props = {
  children?: ReactNode
  sx?: SxProps
  variant?: 'edit' | 'create'
}

const ImageUploadBox = ({ children, sx, variant = 'create' }: Props) => {
  const uploadBoxStyle = {
    base: {
      p: 1,
      height: '100%',
      width: '100%',
      borderRadius: 2.5
    },
    edit: {
      background: '#E5E5E5'
    },
    create: {
      background: '#E9EBF4',
      border: '2px solid #9EA5C7'
    }
  }

  const combinedStyles = {
    ...uploadBoxStyle.base,
    ...(uploadBoxStyle[variant]),
    ...sx
  }

  return (
    <Box sx={combinedStyles}>
      {children}
    </Box>
  )
}

export default ImageUploadBox
