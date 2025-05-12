import { Box, SxProps, Typography } from '@mui/material'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'

type Props = {
  osaRisk: boolean | null
  sx?: SxProps
}

const OSARiskChip = ({ osaRisk, sx }: Props) => {
  let text = null
  switch (osaRisk) {
  case true:
    text = <Typography sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: 400,
      color: '#F70'
    }}><PlayArrowRoundedIcon sx={{ transform: 'rotate(-90deg)', fontSize: 16 }} />High</Typography>
    break
  case false:
    text = <Typography sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      fontFamily: 'Roboto',
      fontSize: 12,
      fontStyle: 'normal',
      fontWeight: 400,
      color: '#A1A1A1'
    }}>N/A</Typography>
    break
  }
  return <Box sx={{
    display: 'flex',
    alignItems: 'center',
    p: 1,
    height: '100%',
    ...sx
  }}>
    {text}
  </Box>
}

export default OSARiskChip
