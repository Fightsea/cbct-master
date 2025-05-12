import { Box, type BoxProps } from '@mui/material'

type DarkBackgroundBoxProps = BoxProps

const DarkBackgroundBox = ({ children, sx, ...props }: DarkBackgroundBoxProps) => {
  return (
    <Box
      sx={{
        filter: 'drop-shadow(0px 50px 50px rgba(0, 7, 41, 0.5))',
        background: 'rgba(9, 10, 15, 0.4)',
        height: '100%',
        width: '100%',
        ...sx,
        padding: 0
      }}
      {...props}
    >
      <Box
        sx={{
          background: 'rgba(255 255 255 0.1)',
          backdropFilter: 'blur(60px)',
          ...sx,
          width: '100%',
          height: '100%'
        }}
        {...props}
      >
        {children}
      </Box>
    </Box>
  )
}

export default DarkBackgroundBox
